import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/createOrder.dto';
import { User } from 'src/users/user.entity';
import { UserGuard } from 'src/guards/user.guard';
import { OrderDto } from './dto/order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard, UserGuard)
  @Post()
  @Post()
  async createOrder(
    @Req() req,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderDto> {
    const user: User = req.user;
    return await this.ordersService.createOrder(user, createOrderDto.products);
  }

  @Get()
  async getAllOrders(): Promise<OrderDto[]> {
    return await this.ordersService.getAllOrders();
  }

  @Get(':id')
  async getOneOrder(@Param('id') orderId: number): Promise<OrderDto> {
    return await this.ordersService.getOneOrder(orderId);
  }
}
