import { Module } from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { UserRolesController } from './user-roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoles } from './entities/user-role.entity';
import { PropertiesService } from 'src/properties/properties.service';
import { RolesService } from 'src/roles/roles.service';
import { Property } from 'src/properties/entities/property.entity';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { Organization } from 'src/organizations/entities/organization.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Property, User, Role, UserRoles, Organization]),
  ],
  controllers: [UserRolesController],
  providers: [
    UserRolesService,
    PropertiesService,
    UsersService,
    OrganizationsService,
    RolesService,
  ],
})
export class UserRolesModule {}
