import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './entities/property.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}
  create(createPropertyDto: CreatePropertyDto) {
    return this.propertyRepository.save(createPropertyDto);
  }

  findAll(skip = 0, take = 20): Promise<[Property[], number]> {
    return this.propertyRepository.findAndCount({ skip, take });
  }

  async findOne(id: string) {
    const org = await this.propertyRepository.findOne({ where: { id } });
    if (!org) {
      throw new NotFoundException('Could not find property');
    }

    return org;
  }

  async update(id: string, updateOrganizationDto: UpdatePropertyDto) {
    const updateOrganization = await this.findOne(id);

    if (updateOrganizationDto.name) {
      updateOrganization.name = updateOrganizationDto.name;
    }
    if (updateOrganizationDto.address) {
      updateOrganization.address = updateOrganizationDto.address;
    }

    const updated = await this.propertyRepository.save(updateOrganization);
    return updated;
  }

  async remove(id: string) {
    await this.propertyRepository.delete({ id });
  }
}
