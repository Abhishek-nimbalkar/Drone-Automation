import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/pirsma.service';
import { Prisma } from '@prisma/client';
import { CreateSiteWithPositionDto } from 'src/site/dto/create-site.dto';
import { UpdateSiteWithPositionDto } from 'src/site/dto/update-site.dto';
import { CreateDroneDto } from 'src/drone/dto/create-drone.dto';
import { UpdateDroneDto } from 'src/drone/dto/update-drone.dto';
import { CreateMissionDto } from 'src/mission/dto/create-mission.dto';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/category/dto/update-category.dto';
import { UpdateMissionDto } from 'src/mission/dto/update-mission.dto';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.prisma.user.create({
        data: {
          user_name: createUserDto.user_name,
          email: createUserDto.email,
          password: createUserDto.password,
        },
        select: {
          id: true,
          email: true,
        },
      });

      return newUser;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        // For duplicate entries, throw a BadRequestException
        throw new BadRequestException('Email already exists');
      } else {
        // For other errors, rethrow the original error
        throw error;
      }
    }
  }

  async findAll() {
    try {
      return await this.prisma.user.findMany();
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      return this.prisma.user.findUniqueOrThrow({
        where: {
          id: id,
        },
        select: {
          id: true,
          email: true,
          user_name: true,
          Drone: true,
          Site: true,
          Category: true,
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  async findByEmail(email: string) {
    try {
      return this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }

  // Site operations

  async addNewSiteForUser(
    userId: string,
    createSiteWithPositionDto: CreateSiteWithPositionDto,
  ) {
    try {
      return this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          Site: {
            create: {
              site_name: createSiteWithPositionDto.site_name,
              position: {
                create: {
                  latitude: createSiteWithPositionDto.position.latitude,
                  longitude: createSiteWithPositionDto.position.longitude,
                },
              },
            },
          },
        },
        select: {
          Site: true,
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  async addExistingSiteForUser(userId: string, siteId: string) {
    try {
      return this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          Site: {
            connect: {
              id: siteId,
            },
          },
        },
        include: {
          Site: true,
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  async updateExistingSiteForUser(
    userId: string,
    siteId: string,
    createSiteWithPositionDto: UpdateSiteWithPositionDto,
  ) {
    try {
      return this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          Site: {
            update: {
              where: {
                id: siteId,
              },
              data: {
                site_name: createSiteWithPositionDto.site_name,
                position: {
                  update: {
                    latitude: createSiteWithPositionDto.position.latitude,
                    longitude: createSiteWithPositionDto.position.longitude,
                  },
                },
              },
            },
          },
        },
        select: {
          user_name: true,
          Site: {
            include: {
              position: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  async getSiteForUser(userId: string, siteId: string) {
    try {
      console.log('userId :>> ', userId);
      return this.prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
          Site: {
            some: {
              id: siteId,
            },
          },
        },
        include: {
          Site: {
            where: {
              id: siteId,
            },
            include: {
              position: true,
              Mission: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  async getSitesForUser(userId: string) {
    try {
      return this.prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
        select: {
          Site: {
            include: {
              position: true,
              Mission: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  async deleteSiteForUser(userId: string, siteId: string) {
    try {
      return this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          Site: {
            disconnect: {
              id: siteId,
            },
          },
        },
        include: {
          Site: {
            include: {
              position: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  // Drone operations

  async addNewDroneForUser(userId: string, createDroneDto: CreateDroneDto) {
    try {
      const newDrone = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          Drone: {
            create: createDroneDto,
          },
        },
        select: {
          id: true,
          user_name: true,
          Drone: true,
        },
      });
      console.log('newDrone :>> ', newDrone);
      return newDrone;
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  async addExistingDroneForUser(userId: string, droneId: string) {
    try {
      return this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          Drone: {
            connect: {
              drone_id: droneId,
            },
          },
        },
        include: {
          Drone: true,
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  async updateExistingDroneForUser(
    userId: string,
    droneId: string,
    updateSiteForUser: UpdateDroneDto,
  ) {
    try {
      return this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          Drone: {
            update: {
              where: {
                drone_id: droneId,
              },
              data: updateSiteForUser,
            },
          },
        },
        include: {
          Drone: true,
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  async getDronesForUser(userId: string) {
    try {
      return this.prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
        select: {
          Drone: true,
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  async getDroneForUser(userId: string, droneId: string) {
    try {
      return this.prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
          Drone: {
            some: {
              drone_id: droneId,
            },
          },
        },
        select: {
          Drone: {
            where: {
              drone_id: droneId,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  async deleteDroneForUser(userId: string, droneId: string) {
    try {
      return this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          Drone: {
            update: {
              where: {
                drone_id: droneId,
              },
              data: {
                deleted_by: {
                  push: userId,
                },
              },
            },
            disconnect: {
              drone_id: droneId,
            },
          },
        },
        include: {
          Drone: true,
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  // Site Drone operations
  async addNewDroneUnderSiteForUser(
    userId: string,
    siteId: string,
    createDroneDto: CreateDroneDto,
  ) {
    try {
      return this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          Site: {
            update: {
              where: {
                id: siteId,
              },
              data: {
                Drone: {
                  create: createDroneDto,
                },
              },
            },
          },
        },
        include: {
          Site: {
            where: {
              id: siteId,
            },
            include: {
              Drone: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  async addExistingDroneUnderSiteForUser(
    userId: string,
    siteId: string,
    droneId: string,
  ) {
    try {
      return this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          Site: {
            update: {
              where: {
                id: siteId,
              },
              data: {
                Drone: {
                  connect: {
                    drone_id: droneId,
                  },
                },
              },
            },
          },
        },
        include: {
          Site: {
            where: {
              id: siteId,
            },
            include: {
              Drone: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  async updateExistingDroneUnderSiteForUser(
    userId: string,
    siteId: string,
    droneId: string,
    updateDroneDto: UpdateDroneDto,
  ) {
    try {
      return this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          Site: {
            update: {
              where: {
                id: siteId,
              },
              data: {
                Drone: {
                  update: {
                    where: {
                      drone_id: droneId,
                    },
                    data: updateDroneDto,
                  },
                },
              },
            },
          },
        },
        include: {
          Site: {
            where: {
              id: siteId,
            },
            include: {
              Drone: {
                where: {
                  drone_id: droneId,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  async shiftExistingDroneUnderSiteForUser(
    userId: string,
    siteId_1: string,
    siteId_2: string,
    droneId: string,
  ) {
    try {
      this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          Site: {
            update: {
              where: {
                id: siteId_1,
              },
              data: {
                Drone: {
                  disconnect: {
                    drone_id: droneId,
                  },
                },
              },
            },
          },
        },
      });
      return await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          Site: {
            update: {
              where: {
                id: siteId_2,
              },
              data: {
                Drone: {
                  connect: {
                    drone_id: droneId,
                  },
                },
              },
            },
          },
        },
        include: {
          Site: {
            where: {
              id: siteId_2,
            },
            include: {
              Drone: {
                where: {
                  drone_id: droneId,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }
  async getDronesUnderSiteForUser(userId: string, siteId: string) {
    try {
      return this.prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
        include: {
          Site: {
            where: {
              id: siteId,
            },
            select: {
              Drone: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  async getDroneUnderSiteForUser(
    userId: string,
    siteId: string,
    droneId: string,
  ) {
    try {
      return this.prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
        include: {
          Site: {
            where: {
              id: siteId,
            },
            select: {
              Drone: {
                where: {
                  drone_id: droneId,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  async deleteExistingDroneUnderSiteForUser(
    userId: string,
    siteId: string,
    droneId: string,
  ) {
    try {
      return this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          Site: {
            update: {
              where: {
                id: siteId,
              },
              data: {
                Drone: {
                  update: {
                    where: {
                      drone_id: droneId,
                    },
                    data: {
                      deleted_by: {
                        push: userId,
                      },
                    },
                  },
                  disconnect: {
                    drone_id: droneId,
                  },
                },
              },
            },
          },
        },
        include: {
          Site: {
            where: {
              id: siteId,
            },
            include: {
              Drone: {
                where: {
                  drone_id: droneId,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  // Site Mission operations
  async addNewMissionUnderSiteForUser(
    userId: string,
    siteId: string,
    createMissionDto: CreateMissionDto,
  ) {
    try {
      return this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          Site: {
            update: {
              where: {
                id: siteId,
              },
              data: {
                Mission: {
                  create: {
                    ...createMissionDto,
                    waypoints: {
                      createMany: {
                        data: createMissionDto.waypoints,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        include: {
          Site: {
            where: {
              id: siteId,
            },
            include: {
              Mission: {
                include: {
                  waypoints: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  // async addExistingMissionUnderSiteForUser(
  //   userId: string,
  //   siteId: string,
  //   missionId: string,
  // ) {
  //   try {
  //     return this.prisma.user.update({
  //       where: {
  //         id: userId,
  //       },
  //       data: {
  //         Site: {
  //           update: {
  //             where: {
  //               id: siteId,
  //             },
  //             data: {
  //               Mission: {
  //                 connect: {
  //                   id: missionId,
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //       include: {
  //         Site: {
  //           include: {
  //             Mission: {
  //               include: {
  //                 waypoints: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     });
  //   } catch (error) {
  //     this.logger.error('error :>> ', error);
  //     throw error;
  //   }
  // }

  async updateExistingMissionUnderSiteForUser(
    userId: string,
    siteId: string,
    missionId: string,
    updateMissionDto: UpdateMissionDto,
  ) {
    try {
      return this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          Site: {
            update: {
              where: {
                id: siteId,
              },
              data: {
                Mission: {
                  update: {
                    where: {
                      id: missionId,
                    },
                    data: {
                      ...updateMissionDto,
                      waypoints: {
                        deleteMany: {},
                        createMany: {
                          data: updateMissionDto.waypoints,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        include: {
          Site: {
            where: {
              id: siteId,
            },
            include: {
              Mission: {
                where: {
                  id: missionId,
                },
                include: {
                  waypoints: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  async getMissionsUnderSiteForUser(userId: string, siteId: string) {
    try {
      return this.prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
        include: {
          Site: {
            where: {
              id: siteId,
            },
            include: {
              Mission: {
                include: {
                  waypoints: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  async getMissionUnderSiteForUser(
    userId: string,
    siteId: string,
    missionId: string,
  ) {
    try {
      return this.prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
        include: {
          Site: {
            where: {
              id: siteId,
            },
            include: {
              Mission: {
                where: {
                  id: missionId,
                },
                include: {
                  waypoints: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  async deleteExistingMissionUnderSiteForUser(
    userId: string,
    siteId: string,
    missionId: string,
  ) {
    try {
      return this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          Site: {
            update: {
              where: {
                id: siteId,
              },
              data: {
                Mission: {
                  disconnect: {
                    id: missionId,
                  },
                },
              },
            },
          },
        },
        include: {
          Site: {
            where: {
              id: siteId,
            },
            include: {
              Mission: {
                where: {
                  id: missionId,
                },
                include: {
                  waypoints: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  // Category operations

  async addNewCategoryForUser(
    userId: string,
    createCategoryDto: CreateCategoryDto,
  ) {
    try {
      return this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          Category: {
            create: createCategoryDto,
          },
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  async addExistingCategoryForUser(userId: string, categoryId: string) {
    try {
      return this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          Category: {
            connect: {
              id: categoryId,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  async updateExistingCategoryForUser(
    userId: string,
    categoryId: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    try {
      return this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          Category: {
            update: {
              where: {
                id: categoryId,
              },
              data: updateCategoryDto,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  async getCategoriesForUser(userId: string) {
    try {
      return this.prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
        select: {
          Category: true,
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  async getCategoryForUser(userId: string, categoryId: string) {
    try {
      return this.prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
        select: {
          Category: {
            where: {
              id: categoryId,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }

  async deleteCategoryForUser(userId: string, categoryId: string) {
    try {
      return this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          Category: {
            disconnect: {
              id: categoryId,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error('error :>> ', error);
      throw error;
    }
  }
}
