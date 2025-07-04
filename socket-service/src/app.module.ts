import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { HealthService } from './services/health.service';
import { PingIndicatorService } from './services/ping.service';
import { SettingModule } from './persistency/settings.module';
import { SettingService } from './persistency/settings.service';
import { DBModule } from './persistency/db.module';
import { AppService } from './services/app.service';
import { WebSocketService } from './services/web-socket.service';
import { AppController } from './controllers/app.controller';
import { HealthcheckController } from './controllers/healthcheck.controller';

const controllers = [AppController, HealthcheckController];

const providers = [
  PingIndicatorService,
  HealthService,
  AppService,
  WebSocketService,
];

@Module({
  imports: [
    TerminusModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    DBModule,
    TypeOrmModule.forRootAsync({
      imports: [SettingModule],
      inject: [SettingService],
      useFactory: (settingService: SettingService) => {
        return settingService.typeOrmUseFactory;
      },
    }),
  ],
  controllers,
  providers,
})
export class AppModule {}
