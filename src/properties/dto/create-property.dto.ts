import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { IsOrganizationIdValid } from 'src/shared/validators/validOrganizationValidator';

export class CreatePropertyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsUUID() // Ensures the organizationId is a valid UUID
  @IsOrganizationIdValid({ message: 'Organization ID is invalid' })
  organizationId: string;
}
