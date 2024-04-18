import { IsNotEmpty, IsString, IsArray, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { Product } from 'src/products/schemas/product.schema';
export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  identifier: string;

  @IsNotEmpty()
  @IsString()
  clientName: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Products array must not be empty' })
  @Type(() => Product)
  products: Product[];
}
