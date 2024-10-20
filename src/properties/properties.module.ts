import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from 'src/organizations/entities/organization.entity';
import { Property } from './entities/property.entity';
import { SharedModule } from 'src/shared/shared.module';
import { OrganizationsService } from 'src/organizations/organizations.service';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([Organization, Property]), // Include the organization repository
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService, OrganizationsService],
})
export class PropertiesModule {}
