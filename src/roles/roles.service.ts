import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    return this.roleRepository.save(createRoleDto);
  }

  findAll() {
    return this.roleRepository.find();
  }

  async findOne(id: string) {
    const role = await this.roleRepository.findOne({
      where: { id },
    });
    if (!role) {
      throw new NotFoundException('Could not find role');
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const updateRole = await this.findOne(id);

    if (updateRoleDto.name) {
      updateRole.name = updateRoleDto.name;
    }
    const updated = await this.roleRepository.save(updateRole);
    return updated;
  }

  async remove(id: string) {
    await this.roleRepository.delete({ id });
  }
}
