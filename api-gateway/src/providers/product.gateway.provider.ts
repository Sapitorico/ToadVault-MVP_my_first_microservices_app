import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { productData } from 'src/models/product.model';

@Injectable()
export class ProductProvider {
  constructor(
    @Inject(process.env.PRODUCT_MICROSERVICE_NAME)
    private productClient: ClientKafka,
  ) {}

  /**
   * Initializes the module and subscribes to the 'add_new_product' response.
   * Connects to the product client.
   */
  async onModuleInit() {
    this.productClient.subscribeToResponseOf('add_new_product');
    await this.productClient.connect();
  }

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
