import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationsService } from 'src/organizations/organizations.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private organizationsService: OrganizationsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const organization = await this.organizationsService.findOne(
      createUserDto.organizationId,
    );
    const hashedDefaultPassword = await bcrypt.hash('password', 10);

    const newUser = this.userRepository.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      phone: createUserDto.phone,
      password: hashedDefaultPassword,
      organization,
    });

    return this.userRepository.save(newUser);
  }

  findAll(skip = 0, take = 20): Promise<[User[], number]> {
    return this.userRepository.findAndCount({ skip, take });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['organization'],
    });
    if (!user) {
      throw new NotFoundException('Could not find user');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updateUser = await this.findOne(id);

    if (updateUserDto.firstName) {
      updateUser.firstName = updateUserDto.firstName;
    }
    if (updateUserDto.lastName) {
      updateUser.lastName = updateUserDto.lastName;
    }
    if (updateUserDto.email) {
      updateUser.email = updateUserDto.email;
    }
    if (updateUserDto.phone) {
      updateUser.phone = updateUserDto.phone;
    }

    const updated = await this.userRepository.save(updateUser);
    return updated;
  }

  async remove(id: string) {
    await this.userRepository.delete({ id });
  }
}
