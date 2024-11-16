import { Module } from '@nestjs/common';
import { SupertokensService } from './supertokens/supertokens.service';
import { MiddlewareConsumer, NestModule, DynamicModule } from '@nestjs/common';
import { AuthMiddleware } from './auth.middleware';
import { ConfigInjectionToken, AuthModuleConfig } from './config.interface';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Organization } from 'src/organizations/entities/organization.entity';

@Module({
  providers: [],
  exports: [],
  controllers: [],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }

  static forRoot({
    connectionURI,
    apiKey,
    appInfo,
  }: AuthModuleConfig): DynamicModule {
    return {
      providers: [
        {
          useValue: {
            appInfo,
            connectionURI,
            apiKey,
          },
          provide: ConfigInjectionToken,
        },
        SupertokensService,
        UsersService,
        OrganizationsService,
      ],
      exports: [],
      imports: [TypeOrmModule.forFeature([User, Organization])],
      module: AuthModule,
    };
  }
}
