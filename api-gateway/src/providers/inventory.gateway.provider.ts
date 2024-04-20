import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inventory, InventoryData } from 'src/entities/inventory.entitie';
import { productData } from 'src/models/product.model';

@Injectable()
export class InventoryProvider {
  constructor(
    @Inject('inventory-microservice') private inventoryClient: ClientProxy,
  ) {}

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

  async getInventory(userId: string) {
    return await this.inventoryClient.send('get_inventory', userId).toPromise();
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
