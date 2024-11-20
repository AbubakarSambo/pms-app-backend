import { Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Dashboard from 'supertokens-node/recipe/dashboard';

import { ConfigInjectionToken, AuthModuleConfig } from '../config.interface';
import { UsersService } from 'src/users/users.service';
import { DataSource } from 'typeorm';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class SupertokensService {
  constructor(
    @Inject(ConfigInjectionToken) private config: AuthModuleConfig,
    private usersService: UsersService,
    private rolesService: RolesService,
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

                  try {
                    let response =
                      await originalImplementation.signUpPOST(input);

                    if (response.status === 'OK') {
                      const user = await queryRunner.manager.save('User', {
                        id: response.user.id,
                        firstName,
                        lastName,
                        email,
                        phone,
                        password,
                      });
                      await queryRunner.manager.save('Organization', {
                        name: organization,
                      });

                      await queryRunner.manager.save('UserRoles', {
                        user,
                        role: superAdminRole,
                      });
                    }

                    await queryRunner.commitTransaction();

                    return response;
                  } catch (err) {
                    // since we have errors lets rollback the changes we made
                    await queryRunner.rollbackTransaction();
                  } finally {
                    // you need to release a queryRunner which was manually instantiated
                    await queryRunner.release();
                  }
                },
              };
            },
          },
        }),
        Session.init({}),
        Dashboard.init(),
      ],
    });
  }
}
