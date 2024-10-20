import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;
}
