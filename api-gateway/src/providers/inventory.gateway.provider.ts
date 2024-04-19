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
    const response = await this.inventoryClient
      .send('add_new_item', data)
      .toPromise();
    return response;
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

  validateBarcode(barcode: string): {
    status?: number;
    success: boolean;
    message?: string;
  } {
    if (typeof barcode !== 'string' || !/^\d+$/.test(barcode)) {
      return {
        status: 400,
        success: false,
        message: "'barcode' must be a string of numbers",
      };
    }
    return { success: true };
  }

  validateItemData(itemData: any): {
    status?: number;
    success: boolean;
    message?: string;
  } {
    if (
      typeof itemData.barcode !== 'string' ||
      !/^\d+$/.test(itemData.barcode)
    ) {
      return {
        status: 400,
        success: false,
        message: "'barcode' must be a string of numbers",
      };
    }

    if (typeof itemData.name !== 'string') {
      return {
        status: 400,
        success: false,
        message: "'name' must be a string",
      };
    }

    if (typeof itemData.price !== 'number') {
      return {
        status: 400,
        success: false,
        message: "'price' must be a number",
      };
    }

    if (typeof itemData.stock !== 'number') {
      return {
        status: 400,
        success: false,
        message: "'stock' must be a number",
      };
    }

    return { success: true };
  }

  instantiateItem(itemData: any, prodcutData: InventoryData): Inventory {
    const item = new Inventory(
      prodcutData.barcode,
      prodcutData.name,
      itemData.price,
      itemData.stock,
      new Date(),
      new Date(),
    );

    return item;
  }
}
