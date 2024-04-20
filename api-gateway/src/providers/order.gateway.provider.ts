import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { inventoryData } from 'src/models/inventory.model';
import { productData } from 'src/models/product.model';

@Injectable()
export class OrderProvider {
  constructor(@Inject('order-microservice') private orderClient: ClientProxy) {}

  async generateOrder(userId: string, itemData: string) {
    const data = {
      user_id: userId,
      itemData: itemData,
    };
    return await this.orderClient.send('order', data).toPromise();
  }
}
