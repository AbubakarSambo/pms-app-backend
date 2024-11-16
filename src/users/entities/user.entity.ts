import { Organization } from 'src/organizations/entities/organization.entity';
import { UserRoles } from 'src/user-roles/entities/user-role.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ unique: true })
  phone: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => UserRoles, (userRole) => userRole.user)
  userRoles: UserRoles[];

  @ManyToOne(() => Organization, (organization) => organization.properties)
  organization: Organization; // Link to the organization that owns the property
}
