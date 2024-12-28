import { Property } from 'src/properties/entities/property.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum RoomStatus {
  RESERVED = 'reserved',
  BOOKED = 'booked',
  CHECKED_IN = 'checkedIn',
  OPEN = 'open',
  CANCELLED = 'cancelled',
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
    default: RoomStatus.OPEN,
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

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
