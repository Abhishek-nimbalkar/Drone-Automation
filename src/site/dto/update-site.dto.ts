import { PartialType } from '@nestjs/mapped-types';
import { CreateSiteWithPositionDto } from './create-site.dto';

export class UpdateSiteWithPositionDto extends PartialType(
  CreateSiteWithPositionDto,
) {}
