import {
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
  IsInt,
  Min,
} from 'class-validator';

export class ProductDto {
  @IsInt()
  @Min(1)
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  products: ProductDto[];
}
