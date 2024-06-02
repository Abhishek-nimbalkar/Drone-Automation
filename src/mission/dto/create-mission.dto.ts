import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class WaypointDto {
  @IsNotEmpty()
  @IsNumber()
  alt: number;

  @IsNotEmpty()
  @IsNumber()
  lat: number;

  @IsNotEmpty()
  @IsNumber()
  lng: number;
}

export class CreateMissionDto {
  @IsNotEmpty()
  @IsNumber()
  alt: number;

  @IsNotEmpty()
  @IsNumber()
  speed: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  siteId: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @ValidateNested({ each: true })
  @Type(() => WaypointDto)
  @IsOptional()
  waypoints?: WaypointDto[];
}
