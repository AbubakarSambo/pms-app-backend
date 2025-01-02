import { Organization } from 'src/organizations/entities/organization.entity';
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
export class Guest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => Organization, (organization) => organization.properties)
  organization: Organization; // Link to the organization that owns the property
}
