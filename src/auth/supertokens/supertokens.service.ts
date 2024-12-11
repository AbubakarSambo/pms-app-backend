import { Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Dashboard from 'supertokens-node/recipe/dashboard';

import { ConfigInjectionToken, AuthModuleConfig } from '../config.interface';
import { UsersService } from 'src/users/users.service';
import { DataSource } from 'typeorm';
import { RolesService } from 'src/roles/roles.service';
import { UserRolesService } from 'src/user-roles/user-roles.service';

@Injectable()
export class SupertokensService {
  constructor(
    @Inject(ConfigInjectionToken) private config: AuthModuleConfig,
    private usersService: UsersService,
    private rolesService: RolesService,
    private userRolesService: UserRolesService,
    private dataSource: DataSource,
  ) {
    supertokens.init({
      appInfo: config.appInfo,
      supertokens: {
        connectionURI: config.connectionURI,
        apiKey: config.apiKey,
      },
      recipeList: [
        EmailPassword.init({
          signUpFeature: {
            formFields: [
              {
                id: 'firstName',
              },
              {
                id: 'lastName',
              },
              {
                id: 'phone',
              },
              {
                id: 'email',
              },
              {
                id: 'password',
              },
              {
                id: 'role',
              },
              {
                id: 'organization',
              },
            ],
          },
          override: {
            apis: (originalImplementation) => {
              return {
                ...originalImplementation,
                signUpPOST: async function (input) {
                  const queryRunner = dataSource.createQueryRunner();
                  await queryRunner.connect();
                  await queryRunner.startTransaction();

                  const fields = input.formFields.reduce((acc, field) => {
                    acc[field.id] = field.value;
                    return acc;
                  }, {});
                  const {
                    firstName,
                    lastName,
                    email,
                    password,
                    phone,
                    role,
                    organization,
                  } = fields as {
                    firstName: string;
                    lastName: string;
                    email: string;
                    phone: string;
                    password: string;
                    role: string;
                    organization: string;
                  };
                  const superAdminRole = await (
                    await rolesService.findAll()
                  ).find((role) => role.name === 'Super Admin');
                  if (originalImplementation.signUpPOST === undefined) {
                    throw Error('Should never come here');
                  }
                  let response = await originalImplementation.signUpPOST(input);
                  let user;
                  if (response.status === 'OK') {
                    try {
                      const org = await queryRunner.manager.save(
                        'Organization',
                        {
                          name: organization,
                        },
                      );
                      user = await queryRunner.manager.save('User', {
                        id: response.user.id,
                        firstName,
                        lastName,
                        email,
                        phone,
                        password,
                        organization: org,
                      });

                      await queryRunner.commitTransaction();
                      await createRole(user);
                      await initSession();

                      return response;
                    } catch (err) {
                      // since we have errors lets rollback the changes we made
                      await queryRunner.rollbackTransaction();
                    }

                    async function initSession() {
                      const userRoles = (
                        await userRolesService.findByUserId(user.id)
                      ).map((userRole) => {
                        return {
                          name: userRole.role?.name ?? '',
                          property: {
                            id: userRole.property?.id,
                            name: userRole.property?.name,
                          },
                        };
                      });
                      const isSuperAdmin = !!userRoles.find(
                        (role) => role.name === 'Super Admin',
                      );
                      // const orgId = (await usersService.findOne(user.id))
                      //   ?.organization?.id;
                      await Session.createNewSession(
                        input.options.req,
                        input.options.res,
                        'public',
                        supertokens.convertToRecipeUserId(user.id),
                        {
                          roles: userRoles,
                          isSuperAdmin,
                          orgId: '',
                        },
                      );
                    }
                    async function createRole(user: any) {
                      try {
                        await queryRunner.startTransaction();

                        await queryRunner.manager.save('UserRoles', {
                          user, // Pass the previously committed user object here
                          role: superAdminRole,
                        });

                        // Commit the transaction after successfully saving the user role
                        await queryRunner.commitTransaction();
                      } catch (error) {
                        await queryRunner.rollbackTransaction();
                        throw error;
                      } finally {
                        await queryRunner.release();
                      }
                    }
                  } else {
                    throw Error(response.status);
                  }
                },
              };
            },
          },
        }),
        Session.init({
          override: {
            functions: (originalImplementation) => {
              return {
                ...originalImplementation,
                createNewSession: async function (input) {
                  try {
                    let userId = input.userId;
                    const userRoles = (
                      await userRolesService.findByUserId(userId)
                    ).map((userRole) => {
                      return {
                        name: userRole.role?.name,
                        property: {
                          id: userRole.property?.id,
                          name: userRole.property?.name,
                        },
                      };
                    });
                    const isSuperAdmin = !!userRoles.find(
                      (role) => role.name === 'Super Admin',
                    );
                    const user = await usersService.findOne(userId);
                    const orgId = user?.organization?.id;
                    input.accessTokenPayload = {
                      ...input.accessTokenPayload,
                      userRoles,
                      isSuperAdmin,
                      orgId,
                    };
                    return originalImplementation.createNewSession(input);
                  } catch (err) {
                    console.log('err', err);
                  }
                },
              };
            },
          },
        }),
        Dashboard.init(),
      ],
    });
  }
}
