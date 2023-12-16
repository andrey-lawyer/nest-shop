import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilesService } from 'src/files/files.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/createProduct.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private fileService: FilesService,
  ) {}

  async createProduct(
    dto: CreateProductDto,
    photo: Express.Multer.File,
  ): Promise<Product> {
    const fileName = await this.fileService.createFile(photo);
    const newProduct = await this.productsRepository.save({
      ...dto,
      price: Number(dto.price),
      photo: fileName,
    });
    return newProduct;
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({});
  }

  async findById(id: number): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async updateProduct(
    id: number,
    updateProductDto: CreateProductDto,
  ): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const updatedProduct = await this.productsRepository.save({
      ...product,
      ...updateProductDto,
      price: Number(updateProductDto.price),
    });

    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<any> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.productsRepository.delete({ id });
    return { message: `${product.name} has been successfully deleted` };
  }
}
