import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { Product } from 'src/products/schemas/product.schema';

@Schema()
export class Order {
  @Prop({ unique: true, required: true })
  identifier: string;

  @Prop({ required: true })
  clientName: string;

  @Prop({ required: true, unique: false })
  total: number;

  @Prop({ required: true, unique: false })
  products: CreateProductDto[];

  @Prop({ default: Date.now }) // This sets the default value to the current date/time
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
