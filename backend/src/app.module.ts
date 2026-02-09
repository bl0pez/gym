import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RoutinesModule } from './routines/routines.module';
import { PrismaModule } from './prisma/prisma.module';
import { TrainingProgramsModule } from './training-programs/training-programs.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    RoutinesModule,
    PrismaModule,
    TrainingProgramsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
