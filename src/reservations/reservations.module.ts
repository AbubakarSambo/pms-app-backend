import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared/shared.module';
import { Reservation } from './entities/reservation.entity';
import { Guest } from 'src/guests/entities/guest.entity';
import { Property } from 'src/properties/entities/property.entity';
import { Room } from 'src/rooms/entities/room.entity';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([Reservation, Guest, Property, Room]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
