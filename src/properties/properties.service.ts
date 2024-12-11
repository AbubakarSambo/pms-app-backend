import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './entities/property.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from 'src/organizations/entities/organization.entity';
import { OrganizationsService } from 'src/organizations/organizations.service';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    private organizationsService: OrganizationsService,
  ) {}
  async create(createPropertyDto: CreatePropertyDto) {
    const organization = await this.organizationsService.findOne(
      createPropertyDto.organizationId,
    );

    const newProperty = this.propertyRepository.create({
      name: createPropertyDto.name,
      address: createPropertyDto.address,
      organization,
    });

    return this.propertyRepository.save(newProperty);
  }

  findAll(skip = 0, take = 20): Promise<[Property[], number]> {
    return this.propertyRepository.findAndCount({ skip, take });
  }

  async findOne(id: string) {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: ['organization'],
    });
    if (!property) {
      throw new NotFoundException('Could not find property');
    }

    return property;
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
