import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SiteService } from './site.service';
import { CreateSiteWithPositionDto } from './dto/create-site.dto';
import { UpdateSiteWithPositionDto } from './dto/update-site.dto';

@Controller('site')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Post()
  create(@Body() createSiteDto: CreateSiteWithPositionDto) {
    return this.siteService.create(createSiteDto);
  }

  @Get()
  findAll() {
    return this.siteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.siteService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSiteDto: UpdateSiteWithPositionDto,
  ) {
    return this.siteService.update(id, updateSiteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.siteService.remove(id);
  }
}
