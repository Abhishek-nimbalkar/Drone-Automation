import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDroneDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  make_name: string;

  @IsNotEmpty()
  @IsString()
  drone_type: string;
}
