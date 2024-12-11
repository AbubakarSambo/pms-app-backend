import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AdminCreateUserDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { signUp } from 'supertokens-node/recipe/emailpassword';
import { Organization } from 'src/organizations/entities/organization.entity';
import { UserRolesService } from 'src/user-roles/user-roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private organizationsService: OrganizationsService,
    @Inject(forwardRef(() => UserRolesService))
    private userRolesService: UserRolesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const organization = await this.organizationsService.findOne(
      createUserDto.organizationId,
    );
    const hashedDefaultPassword = await bcrypt.hash('password', 10);

    const newUser = this.userRepository.create({
      id: createUserDto.id,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      phone: createUserDto.phone,
      password: hashedDefaultPassword,
      organization,
    });

    return this.userRepository.save(newUser);
  }

  async adminCreate(createUserDto: AdminCreateUserDto, adminOrg: Organization) {
    try {
      const response = await signUp('Public', createUserDto.email, 'password');
      if (response.status === 'OK') {
        const user = await this.userRepository.create({
          id: response.user.id,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          email: createUserDto.email,
          phone: createUserDto.phone,
          password: 'password',
          organization: adminOrg,
        });

        const createdUser = await this.userRepository.save(user);

        await this.userRolesService.create({
          userId: createdUser.id,
          roleId: createUserDto.roleId,
          propertyId: createUserDto.propertyId,
        });
        return createdUser;
      } else if (response.status === 'EMAIL_ALREADY_EXISTS_ERROR') {
        throw new Error('User already exists');
      }
    } catch (err) {
      console.log({ err });
      throw new Error('Unable to create user');
    }
  }

  findAll(skip = 0, take = 20): Promise<[User[], number]> {
    return this.userRepository.findAndCount({ skip, take });
  }

  async findOne(id: string) {
    let user;
    try {
      user = await this.userRepository.findOne({
        where: { id },
        relations: ['organization'],
      });
    } catch (e) {
      console.log(e);
    }

    return user || null;
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
