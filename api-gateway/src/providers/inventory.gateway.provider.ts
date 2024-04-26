import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { inventoryData } from 'src/models/inventory.model';
import { productData } from 'src/models/product.model';

@Injectable()
export class InventoryProvider {
  constructor(
    @Inject(process.env.INVENTORY_MICROSERVICE_NAME)
    private inventoryClient: ClientProxy,
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
   * Updates an item in the inventory.
   *
   * @param {string} userId - The ID of the user performing the update.
   * @param {string} barcode - The barcode of the item to update.
   * @param {inventoryData} itemData - The updated data for the item.
   * @returns {Promise<any>} - A promise that resolves to the response from the inventory client.
   */
  async updateItem(userId: string, barcode: string, itemData: inventoryData) {
    const data = {
      user_id: userId,
      barcode: barcode,
      itemData: itemData,
    };
    const response = await this.inventoryClient
      .send('update_itme', data)
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

  async updateInventory(userId: string, items: { barcode: string; quantity: number }[]) {
    const data = {
      user_id: userId,
      items: items
    }
    return await this.inventoryClient
      .send('update_inventory', data).toPromise();
  }
  
  /**
   * Retrieves an item from the order by barcode for a specific user.
   * @param userId - The ID of the user.
   * @param barcode - The barcode of the item.
   * @returns A promise that resolves to the retrieved item.
   */
  async getItemBybarcodeFromOrder(userId: string, barcode: string) {
    const data = {
      user_id: userId,
      barcode: barcode,
    };
    return await this.inventoryClient
      .send('get_item_by_barcode_for_order', data)
      .toPromise();
  }
}
