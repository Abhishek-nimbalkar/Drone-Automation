import { Injectable } from '@nestjs/common';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { PrismaService } from 'src/prisma/pirsma.service';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/category/dto/update-category.dto';

@Injectable()
export class MissionService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createMissionDto: CreateMissionDto) {
    return await this.prisma.mission.create({
      data: {
        alt: createMissionDto.alt,
        name: createMissionDto.name,
        speed: createMissionDto.speed,
        siteId: createMissionDto.siteId,
        waypoints: {
          create: createMissionDto.waypoints,
        },
      },
      include: {
        waypoints: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.mission.findMany({
      include: {
        waypoints: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.mission.findUniqueOrThrow({
      where: {
        id: id,
      },
      include: {
        waypoints: true,
      },
    });
  }

  async update(id: string, updateMissionDto: UpdateMissionDto) {
    await this.prisma.mission.update({
      where: {
        id: id,
      },
      data: {
        alt: updateMissionDto.alt,
        speed: updateMissionDto.speed,
        name: updateMissionDto.name,
        waypoints: {
          deleteMany: {},
        },
      },
      select: {
        waypoints: true,
      },
    });
    const updatedMission = await this.prisma.mission.update({
      where: {
        id: id,
      },
      data: {
        waypoints: {
          create: updateMissionDto.waypoints,
        },
      },
      select: {
        alt: true,
        name: true,
        speed: true,
        waypoints: true,
      },
    });

    return updatedMission;
  }

  async remove(id: string) {
    try {
      return await this.prisma.mission.delete({
        where: {
          id: id,
        },
      });
    } catch (err) {
      console.log('err :>> ', err);
      throw err;
    }
  }
  // Category Operations

  async addNewCategoryForMission(
    missionId: string,
    createCategoryDto: CreateCategoryDto,
  ) {
    return await this.prisma.mission.update({
      where: {
        id: missionId,
      },
      data: {
        Category: {
          create: createCategoryDto,
        },
      },
      include: {
        Category: true,
      },
    });
  }

  async addExistingCategoryForMission(missionId: string, categoryId: string) {
    return await this.prisma.mission.update({
      where: {
        id: missionId,
      },
      data: {
        Category: {
          connect: {
            id: categoryId,
          },
        },
      },
      include: {
        Category: true,
      },
    });
  }

  async updateCategoryForMission(
    missionId: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.prisma.mission.update({
      where: {
        id: missionId,
      },
      data: {
        Category: {
          update: {
            data: updateCategoryDto,
          },
        },
      },
      include: {
        Category: true,
      },
    });
  }

  async getMissionsForCategory(categoryId: string) {
    return await this.prisma.drone.findMany({
      where: {
        Category: {
          every: {
            id: categoryId,
          },
        },
      },
      select: {
        Category: true,
      },
    });
  }
}
