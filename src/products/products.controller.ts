import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpException,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import mongoose from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/jpeg' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.productsService.create(createProductDto, file);
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
    if (!modifiedProduct)
      throw new HttpException(`Product with Id "${id}" not found`, 404);
  }
}
