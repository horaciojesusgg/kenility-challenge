import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class ProductsService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
    credentials: {
      accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    },
  });

  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly configService: ConfigService,
  ) {}

  async create(createProductDto: CreateProductDto, file: Express.Multer.File) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: 'kenility-bucket',
        Key: file.filename,
        Body: file.buffer,
      }),
    );
    const newProduct = new this.productModel({
      ...createProductDto,
      imageUrl: `https://kenility-bucket.s3.amazonaws.com/${file.filename}`,
    });
    return newProduct.save();
  }

  findAll() {
    return this.productModel.find();
  }

  async findOne(SKU: string): Promise<Product> {
    const product = await this.productModel.findOne({ SKU });
    return product;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.productModel.findByIdAndUpdate(id, updateProductDto, {
      new: true,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
