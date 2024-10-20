import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoles } from './entities/user-role.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { PropertiesService } from 'src/properties/properties.service';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UserRolesService {
  constructor(
    @InjectRepository(UserRoles)
    private readonly userRolesRepository: Repository<UserRoles>,
    private usersService: UsersService,
    private propertiesService: PropertiesService,
    private rolesService: RolesService,
  ) {}

  async create(createUserRoleDto: CreateUserRoleDto) {
    const user = await this.usersService.findOne(createUserRoleDto.userId);
    const property = await this.propertiesService.findOne(
      createUserRoleDto.propertyId,
    );
    const role = await this.rolesService.findOne(createUserRoleDto.roleId);

    const newUserRole = this.userRolesRepository.create({
      user,
      property,
      role,
    });
    return this.userRolesRepository.save(newUserRole);
  }

  findAll() {
    return this.userRolesRepository.findAndCount();
  }

  async findOne(id: string) {
    const org = await this.userRolesRepository.findOne({
      where: { id },
      relations: ['user', 'property', 'role'],
    });
    if (!org) {
      throw new NotFoundException('Could not find userRole');
    }

    return org;
  }

  async update(id: string, updateUserRoleDto: UpdateUserRoleDto) {
    const updateUserRole = await this.findOne(id);

    if (updateUserRoleDto.propertyId) {
      const property = await this.propertiesService.findOne(
        updateUserRoleDto.propertyId,
      );
      updateUserRole.property = property;
    }
    if (updateUserRoleDto.userId) {
      const user = await this.usersService.findOne(updateUserRoleDto.userId);
      updateUserRole.user = user;
    }
    if (updateUserRoleDto.roleId) {
      const role = await this.rolesService.findOne(updateUserRoleDto.roleId);
      updateUserRole.role = role;
    }

    const updated = await this.userRolesRepository.save(updateUserRole);
    return updated;
  }

  async remove(id: string) {
    await this.userRolesRepository.delete({ id });
  }
}
