import { Guest } from 'src/guests/entities/guest.entity';
import { Property } from 'src/properties/entities/property.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum ReservationStatus {
  RESERVED = 'reserved',
  BOOKED = 'booked',
  CHECKED_IN = 'checkedIn',
  OPEN = 'open',
  CANCELLED = 'cancelled',
}

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.OPEN,
  })
  status: ReservationStatus;

  @Column()
  totalPrice: number;

  @Column()
  checkInDate: Date;

  @Column()
  checkOutDate: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Guest, (guest) => guest.reservations)
  guest: Guest;

  @ManyToOne(() => Property, (property) => property.reservations)
  property: Property;

  @ManyToOne(() => Room, (room) => room.reservations)
  room: Room;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
