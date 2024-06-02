import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

class CreatePositionDto {
  @IsNotEmpty()
  @IsString()
  latitude: string;

  @IsNotEmpty()
  @IsString()
  longitude: string;
}

export class CreateSiteWithPositionDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsNotEmpty()
  site_name: string;

  @IsNotEmpty()
  @Type(() => CreatePositionDto)
  position: CreatePositionDto;
}
