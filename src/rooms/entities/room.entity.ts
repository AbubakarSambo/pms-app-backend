import { Property } from 'src/properties/entities/property.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum RoomStatus {
  READY = 'ready',
  OCCUPIED = 'occupoed',
  DIRTY = 'dirty',
  OUTOFSERVICE = 'outOfService',
}

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: RoomStatus,
    default: RoomStatus.READY,
  })
  status: RoomStatus;

  @Column()
  description: string;

  @Column()
  capacity: number;

  @Column()
  pricePerNight: number;

  @ManyToOne(() => Property, (property) => property.rooms)
  property: Property;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => Reservation, (reservation) => reservation.room)
  reservations: Reservation[];

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
