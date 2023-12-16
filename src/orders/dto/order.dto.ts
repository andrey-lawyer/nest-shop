import { UserDto } from 'src/users/dto/user.dto';

interface IProduct {
  productId: number;
  quantity: number;
}

export class OrderDto {
  id: number;
  products: IProduct[];
  user: UserDto;
}
