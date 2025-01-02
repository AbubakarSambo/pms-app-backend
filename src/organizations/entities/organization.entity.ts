import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Property } from '../../properties/entities/property.entity';
import { User } from 'src/users/entities/user.entity';
import { Guest } from 'src/guests/entities/guest.entity';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  contactInfo?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => Property, (property) => property.organization)
  properties: Property[]; // One organization can have multiple properties

  @OneToMany(() => Guest, (guest) => guest.organization)
  guests: Guest[]; // One organization can have multiple properties

  @OneToMany(() => User, (user) => user.organization)
  users: User[]; // One organization can have multiple properties
}
