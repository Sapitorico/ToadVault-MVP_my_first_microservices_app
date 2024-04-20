import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { productData } from 'src/models/product.model';

@Injectable()
export class InventoryProvider {
  constructor(
    @Inject('inventory-microservice') private inventoryClient: ClientProxy,
  ) {}

  /**
   * Adds a new item to the inventory.
   * @param userId - The ID of the user.
   * @param productData - The data of the product to be added.
   * @returns A Promise that resolves to the response from the inventory microservice.
   */
  async addItem(userId: string, productData: productData) {
    const data = {
      user_id: userId,
      itemData: productData,
    };
    const response = await this.inventoryClient
      .send('add_new_item', data)
      .toPromise();
    return response;
  }

  /**
   * Retrieves the inventory for a specific user.
   * @param userId - The ID of the user.
   * @returns A Promise that resolves to the inventory data.
   */
  async getInventory(userId: string) {
    return await this.inventoryClient.send('get_inventory', userId).toPromise();
  }

  /**
   * Retrieves an item from the inventory based on its barcode.
   * @param userId - The ID of the user.
   * @param barcode - The barcode of the item.
   * @returns A Promise that resolves to the item data.
   */
  async getItemBybarcode(userId: string, barcode: string) {
    const data = {
      user_id: userId,
      barcode: barcode,
    };
    return await this.inventoryClient
      .send('get_item_by_barcode', data)
      .toPromise();
  }
}
