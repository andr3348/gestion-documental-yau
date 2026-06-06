import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { NotificationModule } from './modules/notification/notification.module';
import { DepartmentModule } from './modules/department/department.module';
import { TramiteModule } from './modules/tramite/tramite.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    NotificationModule,
    DepartmentModule,
    TramiteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
