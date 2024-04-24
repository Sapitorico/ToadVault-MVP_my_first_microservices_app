import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { inventoryData } from 'src/models/inventory.model';

/**
 * Provider class for handling orders.
 */
@Injectable()
export class OrderProvider {
  constructor(
    @Inject(process.env.ORDER_MICROSERVICE_NAME)
    private orderClient: ClientKafka,
  ) {}

  /**
   * Initializes the module and subscribes to response events.
   * Connects the order client to the server.
   */
  async onModuleInit() {
    this.orderClient.subscribeToResponseOf('order');
    this.orderClient.subscribeToResponseOf('get_order');
    this.orderClient.subscribeToResponseOf('remove_item');
    this.orderClient.subscribeToResponseOf('cancel_order');
    await this.orderClient.connect();
  }

  /**
   * Generates an order for a user.
   * @param userId - The ID of the user.
   * @param itemData - The data of the items in the order.
   * @returns A promise that resolves to the generated order.
   */
  async generateOrder(userId: string, itemData: inventoryData) {
    const data = {
      user_id: userId,
      itemData: itemData,
    };
    return await this.orderClient.send('order', data).toPromise();
  }

  /**
   * Retrieves the order for a user.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to the order.
   */
  async getOrderByUserId(userId: string) {
    return await this.orderClient.send('get_order', userId).toPromise();
  }

  /**
   * Removes an item from the user's order.
   * @param userId - The ID of the user.
   * @param barcode - The barcode of the item to remove.
   * @returns A promise that resolves when the item is removed.
   */
  async removeItem(userId: string, barcode: string) {
    const data = {
      user_id: userId,
      barcode: barcode,
    };
    return await this.orderClient.send('remove_item', data).toPromise();
  }

  /**
   * Cancels the order for a user.
   * @param userId - The ID of the user.
   * @returns A promise that resolves when the order is cancelled.
   */
  async cancelOrder(userId: string) {
    return await this.orderClient.send('cancel_order', userId).toPromise();
  }
}
