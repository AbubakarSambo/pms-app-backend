import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SharedModule } from 'src/shared/shared.module';
import { Organization } from 'src/organizations/entities/organization.entity';
import { OrganizationsService } from 'src/organizations/organizations.service';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Organization, User])],
  controllers: [UsersController],
  providers: [UsersService, OrganizationsService],
  exports: [UsersService],
})
export class UsersModule {}
