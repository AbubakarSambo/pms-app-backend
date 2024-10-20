import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class CreateUserRoleDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  propertyId: string;

  @IsUUID()
  roleId: string;
}
