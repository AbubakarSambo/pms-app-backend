import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AdminCreateUserDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { getSession } from 'supertokens-node/recipe/session';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/admin')
  @UseGuards(new AuthGuard())
  async adminCreate(
    @Req() req: Request,
    @Body() createUserDto: AdminCreateUserDto,
  ) {
    const userId = req['userId'];
    const adminOrg = (await this.usersService.findOne(userId)).organization;
    return this.usersService.adminCreate(createUserDto, adminOrg);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(
    @Query('skip') skip: number,
    @Query('take') take: number,
  ): Promise<{ data: User[]; total: number }> {
    const [response, total] = await this.usersService.findAll(
      (skip = 0),
      (take = 20),
    );
    return { data: response, total };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
