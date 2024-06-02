import { Injectable } from '@nestjs/common';
import { CreateSiteWithPositionDto } from './dto/create-site.dto';
import { UpdateSiteWithPositionDto } from './dto/update-site.dto';
import { PrismaService } from 'src/prisma/pirsma.service';

@Injectable()
export class SiteService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createSiteWithPositionDto: CreateSiteWithPositionDto) {
    return await this.prisma.site.create({
      data: {
        site_name: createSiteWithPositionDto.site_name,
        position: {
          create: {
            latitude: createSiteWithPositionDto.position.latitude,
            longitude: createSiteWithPositionDto.position.longitude,
          },
        },
      },
    });
  }

  async findAll() {
    return await this.prisma.site.findMany({
      include: {
        position: true,
      },
    });
  }

  async findOne(id: string) {
    try {
      return await this.prisma.site.findUniqueOrThrow({
        where: {
          id: id,
        },
        include: {
          position: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateSiteWithPositionDto: UpdateSiteWithPositionDto,
  ) {
    return await this.prisma.site.update({
      where: {
        id: id,
      },
      data: {
        site_name: updateSiteWithPositionDto.site_name,
        position: {
          create: {
            latitude: updateSiteWithPositionDto.position.latitude,
            longitude: updateSiteWithPositionDto.position.longitude,
          },
        },
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.site.delete({
      where: {
        id: id,
      },
    });
  }

  async droneForSite(siteId: string) {
    return await this.prisma.site.findUniqueOrThrow({
      where: {
        id: siteId,
      },
      select: {
        Drone: true,
      },
    });
  }

  async getDronesForSite(siteId: string) {
    return await this.prisma.site.findUniqueOrThrow({
      where: {
        id: siteId,
      },
      select: {
        Drone: true,
      },
    });
  }

  async getMissionForSite(siteId: string) {
    return await this.prisma.site.findUniqueOrThrow({
      where: {
        id: siteId,
      },
      select: {
        Mission: true,
      },
    });
  }

  async getMissionsForSite(siteId: string) {
    return await this.prisma.site.findUniqueOrThrow({
      where: {
        id: siteId,
      },
      select: {
        Mission: true,
      },
    });
  }
}
