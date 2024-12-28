import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { SharedModule } from 'src/shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Property } from 'src/properties/entities/property.entity';
import { PropertiesService } from 'src/properties/properties.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { Organization } from 'src/organizations/entities/organization.entity';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([Property, Room, Organization]),
  ],
  controllers: [RoomsController],
  providers: [RoomsService, PropertiesService, OrganizationsService],
})
export class RoomsModule {}
