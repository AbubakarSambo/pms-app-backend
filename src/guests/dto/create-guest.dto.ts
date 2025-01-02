import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { IsOrganizationIdValid } from 'src/shared/validators/validOrganizationValidator';

export class CreateGuestDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsString()
  email?: string;

  @IsString()
  phone?: string;

  @IsNotEmpty()
  @IsUUID() // Ensures the organizationId is a valid UUID
  @IsOrganizationIdValid({ message: 'Organization ID is invalid' })
  organizationId: string;
}
