import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  ConflictException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import mongoose from 'mongoose';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('/sold-last-month')
  async getTotalSoldLastMonth() {
    return await this.ordersService.totalSoldLastMonth();
  }

  @Get('/highest-total-order')
  async getHighestTotalOrder() {
    return await this.ordersService.highestTotalOrder();
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const idIsValid = mongoose.Types.ObjectId.isValid(id);
    if (!idIsValid) throw new HttpException('Id is not valid', 400);
    let modifiedOrder;
    try {
      modifiedOrder = await this.ordersService.update(id, updateOrderDto);
      if (!modifiedOrder) throw new HttpException('Order not found', 404);
    } catch (e) {
      if (e.code === 11000) {
        throw new ConflictException(
          'Order with this identifier already exists.',
        );
      }
      throw new HttpException(e.message, 500);
    }
    return modifiedOrder;
  }
}
