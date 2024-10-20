import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Property } from 'src/properties/entities/property.entity';
import { Role } from 'src/roles/entities/role.entity';

@Entity()
export class UserRoles {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.userRoles, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Property, (property) => property.userRoles, {
    onDelete: 'CASCADE',
  })
  property: Property;

  @ManyToOne(() => Role, (role) => role.userRoles, { onDelete: 'CASCADE' })
  role: Role;
}
