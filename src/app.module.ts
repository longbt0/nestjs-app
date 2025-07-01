import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    UsersModule,
    ProductsModule,
  ],
  controllers: [AppController, CatsController],
  providers: [AppService],
})
export class AppModule {}
