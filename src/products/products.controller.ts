import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import mongoose from 'mongoose';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':sku')
  async findOne(@Param('sku') sku: string) {
    const product = await this.productsService.findOne(sku);
    if (!product)
      throw new HttpException(`Product with SKU "${sku}" not found`, 404);

    return product;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const idIsValid = mongoose.Types.ObjectId.isValid(id);
    if (!idIsValid) throw new HttpException('Id is not valid', 400);
    const modifiedProduct = await this.productsService.update(
      id,
      updateProductDto,
    );
    console.log(modifiedProduct);
    if (!modifiedProduct)
      throw new HttpException(`Product with Id "${id}" not found`, 404);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return '';
  }
}
