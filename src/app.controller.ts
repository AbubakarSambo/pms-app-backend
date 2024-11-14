import { AppService } from './app.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { AuthGuard } from './auth/auth.guard';
import { Session } from './auth/session/session.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // ...
  // Test endpoint for session verification; not part of the Supertokens setup.
  @Get('/test')
  @UseGuards(new AuthGuard())
  getSessionInfo(
    @Session() session: SessionContainer,
  ): Record<string, unknown> {
    return {
      sessionHandle: session.getHandle(),
      userId: session.getUserId(),
      accessTokenPayload: session.getAccessTokenPayload(),
    };
  }
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
