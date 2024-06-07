import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { User } from './users/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import * as dotenv from 'dotenv';
import { ProductController } from './commandes/commandes.controller';
import { ProductService } from './commandes/commandes.service';
import { Product } from './commandes/commandes.entity';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: process.env.DBUSER,
      password: process.env.DBPASS,
      database: 'db',
      entities: [Product, User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Product, User]),
    AuthModule,
  ],
  providers: [ProductService, UsersService],
  controllers: [ProductController, AppController],
})
export class AppModule {}
