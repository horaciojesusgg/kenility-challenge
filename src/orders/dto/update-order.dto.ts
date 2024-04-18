import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Product } from 'src/products/schemas/product.schema';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsNotEmpty()
  @IsString()
  clientName: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Products array must not be empty' })
  @Type(() => Product)
  products: Product[];
}
