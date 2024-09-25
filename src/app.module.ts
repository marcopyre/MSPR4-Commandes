import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { User } from './users/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import * as dotenv from 'dotenv';
import { OrderController } from './commandes/commandes.controller';
import { OrderService } from './commandes/commandes.service';
import { Order } from './commandes/commandes.entity';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MetricsService } from './metrics/metrics.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MetricsInterceptor } from './metrics/metrics.interceptor';
import { ConsumerService } from './messaging/consumer.service';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DBHOST,
      port: 5432,
      username: process.env.DBUSER,
      password: process.env.DBPASS,
      database: process.env.DBNAME,
      entities: [Order, User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Order, User]),
    PrometheusModule.register({
      defaultLabels: {
        app: 'orders-api',
      },
    }),
    AuthModule,
  ],
  providers: [
    OrderService,
    UsersService,
    MetricsService,
    ConsumerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
  controllers: [OrderController, AppController],
})
export class AppModule {}
