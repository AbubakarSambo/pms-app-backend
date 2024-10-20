import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { UserRoles } from 'src/user-roles/entities/user-role.entity';

@Entity()
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Unique identifier for the property

  @ManyToOne(() => Organization, (organization) => organization.properties)
  organization: Organization; // Link to the organization that owns the property

  @Column()
  name: string; // Name of the property

  @Column('text')
  address: string; // Address of the property

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date; // Timestamp for when the property was created

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date; // Timestamp for when the property was last updated

  @OneToMany(() => UserRoles, (userRole) => userRole.property)
  userRoles: UserRoles[];
}
