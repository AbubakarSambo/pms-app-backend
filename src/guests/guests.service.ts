import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Guest } from './entities/guest.entity';
import { Repository } from 'typeorm';
import { OrganizationsService } from 'src/organizations/organizations.service';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
    private organizationsService: OrganizationsService,
  ) {}
  async create(createGuestDto: CreateGuestDto) {
    const organization = await this.organizationsService.findOne(
      createGuestDto.organizationId,
    );

    const newGuest = this.guestRepository.create({
      firstName: createGuestDto.firstName,
      lastName: createGuestDto.lastName,
      email: createGuestDto.email,
      phone: createGuestDto.phone,
      organization,
    });
    return this.guestRepository.save(newGuest);
  }

  findAll(skip = 0, take = 20, orgId): Promise<[Guest[], number]> {
    return this.guestRepository.findAndCount({
      where: { organization: { id: orgId } },
      skip,
      take,
    });
  }

  async findOne(id: string) {
    const guest = await this.guestRepository.findOne({
      where: { id },
      relations: ['organization'],
    });
    if (!guest) {
      throw new NotFoundException('Could not find guest');
    }

    return guest;
  }

  async update(id: string, updateGuestDto: UpdateGuestDto) {
    const updateGuest = await this.findOne(id);

    if (updateGuestDto.firstName) {
      updateGuest.firstName = updateGuestDto.firstName;
    }
    if (updateGuestDto.lastName) {
      updateGuest.lastName = updateGuestDto.lastName;
    }
    if (updateGuestDto.email) {
      updateGuest.email = updateGuestDto.email;
    }
    if (updateGuestDto.phone) {
      updateGuest.phone = updateGuestDto.phone;
    }

    const updated = await this.guestRepository.save(updateGuestDto);
    return updated;
  }

  async remove(id: string) {
    await this.guestRepository.delete({ id });
  }
}
