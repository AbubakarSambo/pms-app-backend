import { Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Dashboard from 'supertokens-node/recipe/dashboard';

import { ConfigInjectionToken, AuthModuleConfig } from '../config.interface';

@Injectable()
export class SupertokensService {
  constructor(@Inject(ConfigInjectionToken) private config: AuthModuleConfig) {
    supertokens.init({
      appInfo: config.appInfo,
      supertokens: {
        connectionURI: config.connectionURI,
        apiKey: config.apiKey,
      },
      recipeList: [
        EmailPassword.init({
          override: {
            functions: (originalImplementation) => {
              return {
                ...originalImplementation,
                signUp: async function (input) {
                  // First we call the original implementation of signUp.
                  let response = await originalImplementation.signUp(input);

                  console.log({ response, input });
                  // Post sign up response, we check if it was successful
                  if (
                    response.status === 'OK' &&
                    response.user.loginMethods.length === 1 &&
                    input.session === undefined
                  ) {
                    console.log({ input });
                    /**
                     *
                     * response.user contains the following info:
                     * - emails
                     * - id
                     * - timeJoined
                     * - tenantIds
                     * - phone numbers
                     * - third party login info
                     * - all the login methods associated with this user.
                     * - information about if the user's email is verified or not.
                     *
                     */
                    // TODO: post sign up logic
                  }
                  return response;
                },
              };
            },
          },
        }),
        Session.init(),
        Dashboard.init(),
      ],
    });
  }
}
