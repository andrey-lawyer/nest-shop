import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './order.entity';
import { User } from 'src/users/user.entity';
import { UserDto } from 'src/users/dto/user.dto';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async createOrder(
    user: User,
    products: { productId: number; quantity: number }[],
  ): Promise<OrderDto> {
    const order = this.orderRepository.create({
      user,
      products,
    });
    const newOrder = await this.orderRepository.save(order);

    return this.mapOrderToDto(newOrder);
  }

  async getAllOrders(): Promise<OrderDto[]> {
    const orders = await this.orderRepository.find({ relations: ['user'] });
    const allOrders = orders.map((order) => this.mapOrderToDto(order));
    return allOrders;
  }

  async getOneOrder(orderId: number): Promise<OrderDto> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return this.mapOrderToDto(order);
  }

  private mapOrderToDto(order: Order): OrderDto {
    const userDto: UserDto = {
      id: order.user.id,
      email: order.user.email,
    };
    return {
      id: order.id,
      products: order.products,
      user: userDto,
    };
  }
}
