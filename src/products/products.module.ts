import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

import { FilesModule } from 'src/files/files.module';
import { Product } from './product.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],

  imports: [TypeOrmModule.forFeature([Product]), FilesModule],
})
export class ProductsModule {}
