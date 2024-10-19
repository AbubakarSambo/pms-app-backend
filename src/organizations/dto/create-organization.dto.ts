import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @IsNotEmpty()
  @IsString()
  name: string; // The name of the organization, required field

  @IsOptional()
  @IsString()
  contactInfo?: string; // Optional contact information (e.g., phone number, email)
}
