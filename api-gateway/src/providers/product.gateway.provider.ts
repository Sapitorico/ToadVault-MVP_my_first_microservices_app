import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { productData } from 'src/models/product.model';

@Injectable()
export class ProductProvider {
  constructor(
    @Inject(process.env.PRODUCT_MICROSERVICE_NAME)
    private productClient: ClientProxy,
  ) {}

  /**
   * Adds a new product.
   * @param productData - The data of the product to be added.
   * @returns A promise that resolves to the response from the product microservice.
   */
  async addNewProduct(productData: productData) {
    const response = await this.productClient
      .send('add_new_product', productData)
      .toPromise();
    return response;
  }
}
