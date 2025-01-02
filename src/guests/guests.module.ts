import { Module } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { GuestsController } from './guests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from 'src/organizations/entities/organization.entity';
import { Guest } from './entities/guest.entity';
import { SharedModule } from 'src/shared/shared.module';
import { OrganizationsService } from 'src/organizations/organizations.service';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Organization, Guest])],
  controllers: [GuestsController],
  providers: [GuestsService, OrganizationsService],
})
export class GuestsModule {}
