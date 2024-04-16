import { Controller, Get, Res, Post, Body, Put, Param } from '@nestjs/common';
import { Response } from 'express';
import { ProductProvider } from 'src/providers/product.provider';

@Controller('products')
export class ProductController {
  constructor(private readonly productProvider: ProductProvider) {}

  @Post()
  async createProduct(@Body() productData: any, @Res() res: Response) {
    const validation = this.productProvider.validateProductData(productData);
    if (!validation.success) {
      return res.status(400).json(validation);
    }
    const product = this.productProvider.instantiateProduct(productData);
    const response = await this.productProvider.addProduct(product);
    return res.status(201).json(response);
  }

  @Get()
  async getProducts(@Res() res: Response) {
    const response = await this.productProvider.getProdcuts();
    res.status(200).json(response);
  }

  @Put(':id')
  async addVariants(
    @Param('id') id: string,
    @Body() productData: any,
    @Res() res: Response,
  ) {
    const validation = this.productProvider.validateProductData(productData);
    if (!validation.success) {
      return res.status(400).json(validation);
    }
    const response = await this.productProvider.updateProduct(id, productData);
    return res.status(200).json(response);
  }
}
