import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room, RoomStatus } from './entities/room.entity';
import { Repository } from 'typeorm';
import { PropertiesService } from 'src/properties/properties.service';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRespository: Repository<Room>,
    private propertiesService: PropertiesService,
  ) {}
  async create(createRoomDto: CreateRoomDto) {
    const property = await this.propertiesService.findOne(
      createRoomDto.propertyId,
    );
    const newRoom = this.roomRespository.create({
      name: createRoomDto.name,
      property,
      status: RoomStatus.OPEN,
      description: createRoomDto.description,
      pricePerNight: createRoomDto.pricePerNight,
      capacity: createRoomDto.capacity,
    });
    return this.roomRespository.save(newRoom);
  }

  findAll(skip = 0, take = 20, propertyId): Promise<[Room[], number]> {
    if (propertyId) {
      return this.roomRespository.findAndCount({
        where: { property: { id: propertyId } },
        skip,
        take,
      });
    } else {
      return this.roomRespository.findAndCount({ skip, take });
    }
  }

  async findOne(id: string) {
    const room = await this.roomRespository.findOne({
      where: { id },
      relations: ['property'],
    });
    if (!room) {
      throw new NotFoundException('Could not find room');
    }

    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    const updateRoom = await this.findOne(id);

    if (updateRoomDto.name) {
      updateRoom.name = updateRoomDto.name;
    }
    if (updateRoomDto.pricePerNight) {
      updateRoom.pricePerNight = updateRoomDto.pricePerNight;
    }
    if (updateRoomDto.description) {
      updateRoom.description = updateRoomDto.description;
    }
    if (updateRoomDto.capacity) {
      updateRoom.capacity = updateRoomDto.capacity;
    }
    if (updateRoomDto.status) {
      updateRoom.status = updateRoomDto.status;
    }
    const updated = await this.roomRespository.save(updateRoomDto);
    return updated;
  }

  async remove(id: string) {
    await this.roomRespository.delete({ id });
  }
}
