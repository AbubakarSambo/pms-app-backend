import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  create(createOrganizationDto: CreateOrganizationDto) {
    return this.organizationRepository.save(createOrganizationDto);
  }

  findAll(skip = 0, take = 20): Promise<[Organization[], number]> {
    return this.organizationRepository.findAndCount({ skip, take });
  }

  async findOne(id: string) {
    const org = await this.organizationRepository.findOne({ where: { id } });
    if (!org) {
      throw new NotFoundException('Could not find organization');
    }

    return org;
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    const updateOrganization = await this.findOne(id);

    if (updateOrganizationDto.name) {
      updateOrganization.name = updateOrganizationDto.name;
    }
    if (updateOrganizationDto.contactInfo) {
      updateOrganization.contactInfo = updateOrganizationDto.contactInfo;
    }
    const updated = await this.organizationRepository.save(updateOrganization);
    return updated;
  }

  async remove(id: string) {
    await this.organizationRepository.delete({ id });
  }
}
