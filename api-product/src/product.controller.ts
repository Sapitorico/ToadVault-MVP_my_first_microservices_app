import { Controller, Get, Res } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Response } from 'express';
import { ProductProvider } from 'src/product.provider';
import { productData } from './entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productProvider: ProductProvider) {}

  /**
   * Creates a new product.
   * @param productData - The data of the product to be created.
   * @returns The response from adding the product.
   */
  @MessagePattern('add_new_product')
  async createProduct(@Payload() productData: productData) {
    const validation = this.productProvider.validateProductData(productData);
    if (!validation.success) {
      return validation;
    }
    const response = await this.productProvider.addProduct(productData);
    return response;
  }

  /**
   * Retrieves all products.
   * @param res - The response object.
   */
  @Get()
  async getProducts(@Res() res: Response) {
    const response = await this.productProvider.getProdcuts();
    res.status(200).json(response);
  }

  /**
   * Retrieves a product by barcode or ID.
   * @param barcode - The barcode or ID of the product.
   * @returns The response from retrieving the product.
   */
  @MessagePattern('get_prodcut_by_barcode_or_id')
  async getProdcutById(@Payload() barcode: string) {
    const code = this.productProvider.verifyBarcode(barcode);
    if (typeof code === 'object' && !code.success) {
      return code;
    }
    const response = await this.productProvider.getProductByBarcode(barcode);
    return response;
  }
}
