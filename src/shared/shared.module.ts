import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../organizations/entities/organization.entity';
import { IsOrganizationIdValidConstraint } from './validators/validOrganizationValidator';

@Module({
  imports: [TypeOrmModule.forFeature([Organization])], // Import the Organization repository here
  providers: [IsOrganizationIdValidConstraint], // Provide the custom validator
  exports: [IsOrganizationIdValidConstraint], // Export it for other modules
})
export class SharedModule {}
