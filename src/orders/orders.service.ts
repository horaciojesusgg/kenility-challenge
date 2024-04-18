import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  create(createOrderDto: CreateOrderDto) {
    const total = createOrderDto.products.reduce((acc, product) => {
      return acc + product.price;
    }, 0);
    const createOrder = new this.orderModel({ ...createOrderDto, total });
    return createOrder.save();
  }

  findAll() {
    return this.orderModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.orderModel.findByIdAndUpdate(id, updateOrderDto, {
      new: true,
    });
  }

  async totalSoldLastMonth() {
    const currentDate = new Date();
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1,
    );

    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0,
    );
    const query = { createdAt: { $gte: startDate, $lte: endDate } };
    const ordersLastMonth = await this.orderModel.find(query);
    const result = ordersLastMonth.reduce((acc, order) => acc + order.total, 0);
    return {
      startDate,
      endDate,
      result,
    };
  }

  async highestTotalOrder() {
    return await this.orderModel.aggregate([
      { $sort: { total: -1 } },
      { $limit: 1 },
    ]);
  }
}
