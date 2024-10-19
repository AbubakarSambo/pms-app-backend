import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Property } from '../../properties/entities/property.entity';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Unique identifier for the organization

  @Column()
  name: string; // Name of the organization

  @Column({ type: 'text', nullable: true })
  contactInfo?: string; // Optional contact information

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date; // Timestamp for when the organization was created

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date; // Timestamp for when the organization was last updated

  @OneToMany(() => Property, (property) => property.organization)
  properties: Property[]; // One organization can have multiple properties
}
