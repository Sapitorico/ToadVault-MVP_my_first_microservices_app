import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { productData } from 'src/models/product.model';

@Injectable()
export class ProductProvider {
  constructor(
    @Inject('product-microservice') private productClient: ClientProxy,
  ) {}

  async addNewProduct(productData: productData) {
    const response = await this.productClient
      .send('add_new_product', productData)
      .toPromise();
    return response;
  }
}
