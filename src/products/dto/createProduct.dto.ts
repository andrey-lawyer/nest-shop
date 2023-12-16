import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  // @IsNumber()
  @IsNotEmpty()
  price: number | string;
}
