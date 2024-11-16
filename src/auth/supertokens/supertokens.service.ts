import { Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Dashboard from 'supertokens-node/recipe/dashboard';

import { ConfigInjectionToken, AuthModuleConfig } from '../config.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SupertokensService {
  constructor(
    @Inject(ConfigInjectionToken) private config: AuthModuleConfig,
    private usersService: UsersService,
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
              ,
              {
                id: 'email',
              },
              ,
              {
                id: 'password',
              },
            ],
          },
          override: {
            apis: (originalImplementation) => {
              return {
                ...originalImplementation,
                signUpPOST: async function (input) {
                  const fields = input.formFields.reduce((acc, field) => {
                    acc[field.id] = field.value;
                    return acc;
                  }, {});
                  const { firstName, lastName, email, password, phone } =
                    fields as {
                      firstName: string;
                      lastName: string;
                      email: string;
                      phone: string;
                      password: string;
                    };
                  // const { firstName, lastName, email, phone } =
                  //   input.formFields;
                  if (originalImplementation.signUpPOST === undefined) {
                    throw Error('Should never come here');
                  }

                  // First we call the original implementation of signUpPOST.
                  let response = await originalImplementation.signUpPOST(input);

                  // Post sign up response, we check if it was successful
                  if (response.status === 'OK') {
                    await usersService.create({
                      id: response.user.id,
                      firstName,
                      lastName,
                      email,
                      phone,
                      password,
                    });
                  }
                  return response;
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
