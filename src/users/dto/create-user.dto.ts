import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { IsOrganizationIdValid } from 'src/shared/validators/validOrganizationValidator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsUUID() // Ensures the organizationId is a valid UUID
  @IsOrganizationIdValid({ message: 'Organization ID is invalid' })
  organizationId: string;
}
