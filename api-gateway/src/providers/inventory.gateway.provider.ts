import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inventory, InventoryData } from 'src/entities/inventory.entitie';

@Injectable()
export class InventoryProvider {
  constructor(
    @Inject('inventory-microservice') private inventoryClient: ClientProxy,
  ) {}

  async addItem(storeId: string, itemData: any, productData: any) {
    const newItem = this.instantiateItem(itemData, productData);
    const data = {
      storeId: storeId,
      itemData: newItem,
    };
    const product = await this.inventoryClient
      .send('add_new_item', data)
      .toPromise();
    return product;
  }

  async getInventory(storeId: string) {
    return await this.inventoryClient
      .send('get_inventory', storeId)
      .toPromise();
  }

  async getItemBybarcode(storeId: string, barcode: string) {
    const data = {
      storeId: storeId,
      barcode: barcode,
    };
    return await this.inventoryClient
      .send('get_item_by_barcode', data)
      .toPromise();
  }

  validateBarcode(barcode: string): { success: boolean; message?: string } {
    if (typeof barcode !== 'string' || !/^\d+$/.test(barcode)) {
      return {
        success: false,
        message: "'barcode' must be a string of numbers",
      };
    }
    return { success: true };
  }

  validateItemData(itemData: any): {
    success: boolean;
    message?: string;
  } {
    if (
      typeof itemData.barcode !== 'string' ||
      !/^\d+$/.test(itemData.barcode)
    ) {
      return {
        success: false,
        message: "'barcode' must be a string of numbers",
      };
    }

    if (typeof itemData.name !== 'string') {
      return { success: false, message: "'name' must be a string" };
    }

    if (typeof itemData.price !== 'number') {
      return { success: false, message: "'price' must be a number" };
    }

    if (typeof itemData.stock !== 'number') {
      return { success: false, message: "'stock' must be a number" };
    }

    if (Array.isArray(itemData.variants)) {
      for (let variant of itemData.variants) {
        if (typeof variant.name !== 'string') {
          return { success: false, message: "'variant.name' must be a string" };
        }
      }
    } else {
      return { success: false, message: "'variants' must be an array" };
    }

    return { success: true };
  }

  /**
   * Instantiates an item object based on the provided item data.
   *
   * @param ItemData - The item data used to create the item object.
   * @returns An instance of the Inventory class representing the item.
   */
  instantiateItem(itemData: any, prodcutData: InventoryData): Inventory {
    const item = new Inventory(
      prodcutData.barcode,
      prodcutData.name,
      itemData.price,
      itemData.stock,
      new Date(),
      new Date(),
      prodcutData.variants,
    );

    return item;
  }
}
