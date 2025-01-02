import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Property } from 'src/properties/entities/property.entity';
import { Room } from './entities/room.entity';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  async findAll(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('propertyId') propertyId: string,
  ): Promise<{ data: Room[]; total: number }> {
    const [response, total] = await this.roomsService.findAll(
      (skip = 0),
      (take = 20),
      propertyId,
    );
    return { data: response, total };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePropertyDto: UpdateRoomDto) {
    return this.roomsService.update(id, updatePropertyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id);
  }
}
