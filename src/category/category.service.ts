import { Injectable, Logger } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/pirsma.service';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);
  constructor(private readonly prisma: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    return await this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async findAll() {
    return await this.prisma.category.findMany();
  }

  async findOne(id: string) {
    try {
      return await this.prisma.category.findUniqueOrThrow({
        where: {
          id: id,
        },
      });
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.prisma.category.update({
      where: {
        id: id,
      },
      data: updateCategoryDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.category.delete({
      where: {
        id: id,
      },
    });
  }

  // // User Operations // already in user.service.ts

  // async addNewCategoryForUser(
  //   userId: string,
  //   createCategoryDto: CreateCategoryDto,
  // ) {
  //   return await this.prisma.user.update({
  //     where: {
  //       id: userId,
  //     },
  //     data: {
  //       Category: {
  //         create: createCategoryDto,
  //       },
  //     },
  //     include: {
  //       Category: true,
  //     },
  //   });
  // }

  // async addCategoryForUser(userId: string, categoryId: string) {
  //   return await this.prisma.user.update({
  //     where: {
  //       id: userId,
  //     },
  //     data: {
  //       Category: {
  //         connect: {
  //           id: categoryId,
  //         },
  //       },
  //     },
  //     include: {
  //       Category: true,
  //     },
  //   });
  // }

  // async updateExistingCategoryForUser(
  //   userId: string,
  //   categoryId: string,
  //   updateCategoryDto: UpdateCategoryDto,
  // ) {
  //   return await this.prisma.category.update({
  //     where: {
  //       id: categoryId,
  //     },
  //     data: updateCategoryDto,
  //     include: {
  //       User: true,
  //     },
  //   });
  // }

  // async getCategoriesForUser(userId: string) {
  //   return await this.prisma.category.findMany({
  //     where: {
  //       User: { id: userId },
  //     },
  //   });
  // }

  // async getCategoryForUser(userId: string, categoryId: string) {
  //   return await this.prisma.category.findFirst({
  //     where: {
  //       id: categoryId,
  //       User: { id: userId },
  //     },
  //     include: {
  //       User: true,
  //     },
  //   });
  // }
  // async deleteCategoryForUser(userId: string, categoryId: string) {
  //   return await this.prisma.user.update({
  //     where: {
  //       id: userId,
  //     },
  //     data: {
  //       Category: {
  //         disconnect: {
  //           id: categoryId,
  //         },
  //       },
  //     },
  //     include: {
  //       Category: true,
  //     },
  //   });
  // }

  // Mission Operations

  getMissionsForCategory(categoryId: string) {
    try {
      return this.prisma.category.findUniqueOrThrow({
        where: {
          id: categoryId,
        },
        select: {
          Mission: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Drone Operations
  getDronesForCategory(categoryId: string) {
    return this.prisma.category.findUniqueOrThrow({
      where: {
        id: categoryId,
      },
      select: {
        Drone: true,
      },
    });
  }
}
