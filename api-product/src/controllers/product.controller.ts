import { Controller, Get, Res, Post, Body, Put, Param } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { Response } from 'express';
import { Product } from 'src/entities/product.entity';
import { ProductProvider } from 'src/providers/product.provider';

/**
 * The ProductController class handles the HTTP requests related to products.
 * It provides endpoints for creating, retrieving, updating, and deleting products.
 */
@Controller('products')
export class ProductController {
  constructor(private readonly productProvider: ProductProvider) {}

  @EventPattern('add_new_product')
  async createProduct(productData: Product) {
    const validation = this.productProvider.validateProductData(productData);
    if (!validation.success) {
      return validation;
    }
    const product = this.productProvider.instantiateProduct(productData);
    const response = await this.productProvider.addProduct(product);
    return response;
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

  @EventPattern('get_prodcut_by_barcode_or_id')
  async getProdcutById(barcode: string) {
    const code = this.productProvider.verifyBarcode(barcode);
    if (typeof code === 'object' && !code.success) {
      return code;
    }
    const response = await this.productProvider.getProductByBarcode(barcode);
    return response;
  }
}
