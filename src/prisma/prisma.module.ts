import { Module } from '@nestjs/common';
import { PrismaService } from './pirsma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], //export this service to use in other modules
})
export class PrismaModule {}
