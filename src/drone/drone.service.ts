import { Injectable } from '@nestjs/common';
import { CreateDroneDto } from './dto/create-drone.dto';
import { UpdateDroneDto } from './dto/update-drone.dto';
import { PrismaService } from 'src/prisma/pirsma.service';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';

@Injectable()
export class DroneService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createDroneDto: CreateDroneDto) {
    return await this.prisma.drone.create({
      data: {
        name: createDroneDto.name,
        make_name: createDroneDto.make_name,
        drone_type: createDroneDto.drone_type,
      },
    });
  }

  async findAll() {
    return await this.prisma.drone.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.drone.findUniqueOrThrow({
      where: {
        drone_id: id,
      },
    });
  }

  async update(id: string, updateDroneDto: UpdateDroneDto) {
    return await this.prisma.drone.update({
      where: {
        drone_id: id,
      },
      data: {
        name: updateDroneDto.name,
        make_name: updateDroneDto.make_name,
        drone_type: updateDroneDto.drone_type,
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.drone.delete({
      where: {
        drone_id: id,
      },
    });
  }

  // Category Operations

  async addNewCategoryForDrone(
    droneId: string,
    createCategoryDto: CreateCategoryDto,
  ) {
    return await this.prisma.drone.update({
      where: {
        drone_id: droneId,
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

  async addExistingCategoryForDrone(droneId: string, categoryId: string) {
    return await this.prisma.drone.update({
      where: {
        drone_id: droneId,
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
  async getDronesForCategory(categoryId: string) {
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

  async getCategoriesForDrone(droneId: string) {
    return await this.prisma.drone.findUniqueOrThrow({
      where: {
        drone_id: droneId,
      },
      select: {
        Category: true,
      },
    });
  }

  async removeCategoryForDrone(droneId: string, categoryId: string) {
    return await this.prisma.drone.update({
      where: {
        drone_id: droneId,
      },
      data: {
        Category: {
          disconnect: {
            id: categoryId,
          },
        },
      },
      include: {
        Category: true,
      },
    });
  }
}
