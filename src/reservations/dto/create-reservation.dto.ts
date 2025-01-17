import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { IsOrganizationIdValid } from 'src/shared/validators/validOrganizationValidator';
import { ReservationStatus } from '../entities/reservation.entity';
import { Guest } from 'src/guests/entities/guest.entity';
import { Property } from 'src/properties/entities/property.entity';
import { Room } from 'src/rooms/entities/room.entity';

export class CreateReservationDto {
  @IsNotEmpty()
  status: ReservationStatus;

  @IsNotEmpty()
  totalPrice: number;

  @IsNotEmpty()
  checkInDate: Date;

  @IsNotEmpty()
  checkOutDate: Date;

  @IsNotEmpty()
  guest: Guest;

  @IsNotEmpty()
  property: Property;

  @IsNotEmpty()
  room: Room;
}
