import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
import { ProductController } from './commandes/commandes.controller';
import { ProductService } from './commandes/commandes.service';
import { Product } from './commandes/commandes.entity';
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
      entities: [Product],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Product]),
    PrometheusModule.register({
      defaultLabels: {
        app: 'orders-api',
      },
    }),
    AuthModule,
  ],
  providers: [
    ProductService,
    MetricsService,
    ConsumerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
  controllers: [ProductController, AppController],
})
export class AppModule { }
