import { Module } from '@nestjs/common';
import { SupertokensService } from './supertokens/supertokens.service';
import { MiddlewareConsumer, NestModule, DynamicModule } from '@nestjs/common';
import { AuthMiddleware } from './auth.middleware';
import { ConfigInjectionToken, AuthModuleConfig } from './config.interface';
import { UsersService } from 'src/users/users.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/entities/role.entity';
import { UserRolesService } from 'src/user-roles/user-roles.service';
import { UserRoles } from 'src/user-roles/entities/user-role.entity';
import { PropertiesService } from 'src/properties/properties.service';
import { Property } from 'src/properties/entities/property.entity';

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
        RolesService,
        UserRolesService,
        PropertiesService,
      ],
      exports: [],
      imports: [
        TypeOrmModule.forFeature([
          User,
          Organization,
          Role,
          UserRoles,
          Property,
        ]),
      ],
      module: AuthModule,
    };
  }
}
