import { Controller, Get, Res, Post, Body, Put, Param } from '@nestjs/common';
import { Response } from 'express';
import { Product } from 'src/entities/product.entity';
import { ProductProvider } from 'src/providers/product.provider';

@Controller('products')
export class ProductController {
  constructor(private readonly productProvider: ProductProvider) {}

  @Post()
  async createProduct(@Body() productData: Product, @Res() res: Response) {
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
    @Body() productData: Product,
    @Res() res: Response,
  ) {
    const validation = this.productProvider.validateProductData(productData);
    if (!validation.success) {
      return res.status(400).json(validation);
    }
    const response = await this.productProvider.updateProduct(id, productData);
    return res.status(200).json(response);
  }

  @Get(':barcode_id')
  async getProdcutById(
    @Param('barcode_id') barcode_id: string,
    @Res() res: Response,
  ) {
    const response =
      await this.productProvider.getProductByBarcodeOrID(barcode_id);
    return res.status(200).json(response);
  }
}
