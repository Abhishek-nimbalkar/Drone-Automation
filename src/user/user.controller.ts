import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ExtractUserId } from 'src/common/decorator/extract-user-id.decorator';
import { CreateSiteWithPositionDto } from 'src/site/dto/create-site.dto';
import { UpdateSiteWithPositionDto } from 'src/site/dto/update-site.dto';
import { CreateDroneDto } from 'src/drone/dto/create-drone.dto';
import { UpdateDroneDto } from 'src/drone/dto/update-drone.dto';
import { CreateMissionDto } from 'src/mission/dto/create-mission.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findOne(@ExtractUserId() userId: string) {
    return this.userService.findOne(userId);
  }
  // Site routes for user

  @Post('/site')
  addNewSiteToUser(
    @ExtractUserId() userId: string,
    @Body() createSiteWithPositionDto: CreateSiteWithPositionDto,
  ) {
    return this.userService.addNewSiteForUser(
      userId,
      createSiteWithPositionDto,
    );
  }

  @Post('/site/:siteId')
  addExistingSiteToUser(
    @ExtractUserId() userId: string,
    @Param('siteId') siteId: string,
  ) {
    return this.userService.addExistingSiteForUser(userId, siteId);
  }

  @Patch('/site/:siteId')
  updateSiteForUser(
    @ExtractUserId() userId: string,
    @Param('siteId') siteId: string,
    @Body() updateSiteWithPositionDto: UpdateSiteWithPositionDto,
  ) {
    return this.userService.updateExistingSiteForUser(
      userId,
      siteId,
      updateSiteWithPositionDto,
    );
  }
  @Get('/site')
  getSitesForUser(@ExtractUserId() userId: string) {
    return this.userService.getSitesForUser(userId);
  }

  @Get('/site/:siteId')
  getSiteForUser(
    @ExtractUserId() userId: string,
    @Param('siteId') siteId: string,
  ) {
    return this.userService.getSiteForUser(userId, siteId);
  }

  @Delete('/site/:siteId')
  deleteSiteForUser(
    @ExtractUserId() userId: string,
    @Param('siteId') siteId: string,
  ) {
    return this.userService.deleteSiteForUser(userId, siteId);
  }

  // Drone routes for user
  @Post('/drone')
  addNewDroneToUser(
    @ExtractUserId() userId: string,
    @Body() createDroneDto: CreateDroneDto,
  ) {
    return this.userService.addNewDroneForUser(userId, createDroneDto);
  }

  @Post('/drone/:droneId')
  addExistingDroneToUser(
    @ExtractUserId() userId: string,
    @Param('droneId') droneId: string,
  ) {
    return this.userService.addExistingDroneForUser(userId, droneId);
  }

  @Patch('/drone/:droneId')
  updateDroneForUser(
    @ExtractUserId() userId: string,
    @Param('droneId') droneId: string,
    @Body() updateDroneDto: UpdateDroneDto,
  ) {
    return this.userService.updateExistingDroneForUser(
      userId,
      droneId,
      updateDroneDto,
    );
  }

  @Get('/drones')
  getDroneForUser(@ExtractUserId() userId: string) {
    return this.userService.getDronesForUser(userId);
  }

  @Get('/drone/:droneId')
  getDronesForUser(
    @ExtractUserId() userId: string,
    @Param('droneId') droneId: string,
  ) {
    return this.userService.getDroneForUser(userId, droneId);
  }

  @Delete('/drone/:droneId')
  deleteDroneForUser(
    @ExtractUserId() userId: string,
    @Param('droneId') droneId: string,
  ) {
    return this.userService.deleteDroneForUser(userId, droneId);
  }

  // Routes for  Drone  Under User's Site

  @Post('/site/:siteId/drone')
  addNewDroneUnderSiteForUser(
    @ExtractUserId() userId: string,
    @Param('siteId') siteId: string,
    @Body() createDroneDto: CreateDroneDto,
  ) {
    return this.userService.addNewDroneUnderSiteForUser(
      userId,
      siteId,
      createDroneDto,
    );
  }

  @Post('/site/:siteId/drone/:droneId')
  addExistingDroneUnderSiteForUser(
    @ExtractUserId() userId: string,
    @Param('siteId') siteId: string,
    @Param('droneId') droneId: string,
  ) {
    return this.userService.addExistingDroneUnderSiteForUser(
      userId,
      siteId,
      droneId,
    );
  }

  @Patch('/site/:siteId/drone/:droneId')
  updateDroneUnderSiteForUser(
    @ExtractUserId() userId: string,
    @Param('siteId') siteId: string,
    @Param('droneId') droneId: string,
    @Body() updateDroneDto: UpdateDroneDto,
  ) {
    return this.userService.updateExistingDroneUnderSiteForUser(
      userId,
      siteId,
      droneId,
      updateDroneDto,
    );
  }
  @Patch('/site/:siteIdFirst/:siteIdSecond/shift/drone/:droneId')
  shiftDroneUnderSiteForUser(
    @ExtractUserId() userId: string,
    @Param('siteIdFirst') siteIdFirst: string,
    @Param('siteIdSecond') siteIdSecond: string,
    @Param('droneId') droneId: string,
  ) {
    return this.userService.shiftExistingDroneUnderSiteForUser(
      userId,
      siteIdFirst,
      siteIdSecond,
      droneId,
    );
  }

  @Get('/site/:siteId/drones')
  getDronesUnderSiteForUser(
    @ExtractUserId() userId: string,
    @Param('siteId') siteId: string,
  ) {
    return this.userService.getDronesUnderSiteForUser(userId, siteId);
  }

  @Get('/site/:siteId/drone/:droneId')
  getDroneUnderSiteForUser(
    @ExtractUserId() userId: string,
    @Param('siteId') siteId: string,
    @Param('droneId') droneId: string,
  ) {
    return this.userService.getDroneUnderSiteForUser(userId, siteId, droneId);
  }

  @Delete('/site/:siteId/drone/:droneId')
  deleteDroneUnderSiteForUser(
    @ExtractUserId() userId: string,
    @Param('siteId') siteId: string,
    @Param('droneId') droneId: string,
  ) {
    return this.userService.deleteExistingDroneUnderSiteForUser(
      userId,
      siteId,
      droneId,
    );
  }

  //Site Missions routes for user

  @Post('/site/:siteId/mission')
  addNewMissionUnderSiteForUser(
    @ExtractUserId() userId: string,
    @Param('siteId') siteId: string,
    @Body() createMissionDto: CreateMissionDto,
  ) {
    return this.userService.addNewMissionUnderSiteForUser(
      userId,
      siteId,
      createMissionDto,
    );
  }
  @Patch('/site/:siteId/mission/:missionId')
  updateMissionUnderSiteForUser(
    @ExtractUserId() userId: string,
    @Param('siteId') siteId: string,
    @Param('missionId') missionId: string,
    @Body() createMissionDto: CreateMissionDto,
  ) {
    return this.userService.updateExistingMissionUnderSiteForUser(
      userId,
      siteId,
      missionId,
      createMissionDto,
    );
  }

  @Get('/site/:siteId/missions')
  getMissionsUnderSiteForUser(
    @ExtractUserId() userId: string,
    @Param('siteId') siteId: string,
  ) {
    return this.userService.getMissionsUnderSiteForUser(userId, siteId);
  }

  @Get('/site/:siteId/mission/:missionId')
  getMissionUnderSiteForUser(
    @ExtractUserId() userId: string,
    @Param('siteId') siteId: string,
    @Param('missionId') missionId: string,
  ) {
    return this.userService.getMissionUnderSiteForUser(
      userId,
      siteId,
      missionId,
    );
  }

  @Delete('/site/:siteId/mission/:missionId')
  deleteMissionUnderSiteForUser(
    @ExtractUserId() userId: string,
    @Param('siteId') siteId: string,
    @Param('missionId') missionId: string,
  ) {
    return this.userService.deleteExistingMissionUnderSiteForUser(
      userId,
      siteId,
      missionId,
    );
  }
}
