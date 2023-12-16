import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Get,
  UseGuards,
  Param,
  ParseIntPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { CreateProductDto } from './dto/createProduct.dto';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    const product = await this.productsService.createProduct(
      createProductDto,
      photo,
    );
    return { message: 'Product created successfully', product };
  }

  @Get()
  async findAll() {
    const products = this.productsService.findAll();
    return products;
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const product = await this.productsService.findById(id);

    return product;
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: CreateProductDto,
  ) {
    const updatedProduct = await this.productsService.updateProduct(
      id,
      updateProductDto,
    );
    return { message: 'Product updated successfully', product: updatedProduct };
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const message = await this.productsService.deleteProduct(id);
    return message;
  }
}
