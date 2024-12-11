import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SharedModule } from 'src/shared/shared.module';
import { Organization } from 'src/organizations/entities/organization.entity';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { UserRolesService } from 'src/user-roles/user-roles.service';
import { UserRoles } from 'src/user-roles/entities/user-role.entity';
import { PropertiesService } from 'src/properties/properties.service';
import { Property } from 'src/properties/entities/property.entity';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/entities/role.entity';
import { UserRolesModule } from 'src/user-roles/user-roles.module';
import { PropertiesModule } from 'src/properties/properties.module';

@Module({
  imports: [
    SharedModule,
    UserRolesModule,
    PropertiesModule,
    TypeOrmModule.forFeature([Organization, UserRoles, User, Property, Role]),
  ],
  controllers: [UsersController],
  providers: [
    PropertiesService,
    UsersService,
    OrganizationsService,
    UserRolesService,
    RolesService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
