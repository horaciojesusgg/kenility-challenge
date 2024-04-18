import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9-]+$/, {
    message: 'SKU may only contain letters, numbers and the character "-"',
  })
  SKU: string;

  @IsString()
  @Matches(/^[Z0-9-.]+$/, {
    message: 'Only numbers allowed',
  })
  price: string;
}
