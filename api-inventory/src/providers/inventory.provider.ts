import { Injectable } from '@nestjs/common';
import { DatabaseProvider } from 'src/databases/db_connection';
import { Inventory, InventoryData } from 'src/entities/inventory.entitie';
import * as Joi from 'joi';
import { ObjectId } from 'mongodb';

@Injectable()
export class InventoryProvider {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  async addItem(
    storeId: string,
    itemData: Inventory,
  ): Promise<{
    status: number;
    success: boolean;
    message?: string;
  }> {
    const db = this.databaseProvider.getDb();
    const inventoryCollection = db.collection(`inventory_store_${storeId}`);
    const item = await inventoryCollection.findOne({
      barcode: itemData.barcode,
    });
    if (!item) {
      await inventoryCollection.insertOne(itemData);
    } else {
      await inventoryCollection.updateOne(
        { barcode: itemData.barcode },
        { $inc: { stock: itemData.stock } },
      );
    }
    return { status: 201, success: true, message: 'Item added successfully' };
  }

  async getInventory(storeId: string): Promise<{
    status: number;
    success: boolean;
    message: string;
    inventory: InventoryData[];
  }> {
    const db = this.databaseProvider.getDb();
    const inventoryCollection = db.collection(`inventory_store_${storeId}`);
    const inventory = await inventoryCollection.find().toArray();
    return {
      status: 200,
      success: true,
      message: 'Items retrieved successfully',
      inventory: inventory as InventoryData[],
    };
  }

  async getItemByBarcode(
    storeId: string,
    barcode: string,
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
    item?: InventoryData;
  }> {
    const db = this.databaseProvider.getDb();
    const productsCollection = db.collection(`inventory_store_${storeId}`);
    const item = await productsCollection.findOne({
      barcode: barcode,
    });
    if (!item) {
      return {
        status: 404,
        success: false,
        message: 'Item not found',
      };
    }
    return {
      status: 200,
      success: true,
      message: 'Item retrieved successfully',
      item: { ...item } as InventoryData,
    };
  }

  validateStore(storeId: string): {
    status?: number;
    success: boolean;
    message?: string;
  } {
    if (typeof storeId !== 'string') {
      return {
        status: 400,
        success: false,
        message: "'store_id' must be a string",
      };
    }
    return { success: true };
  }

  validateItemData(itemData: InventoryData): {
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

    if (Array.isArray(itemData.variants)) {
      for (let variant of itemData.variants) {
        if (typeof variant.name !== 'string') {
          return {
            status: 400,
            success: false,
            message: "'variant.name' must be a string",
          };
        }
      }
    } else {
      return {
        status: 400,
        success: false,
        message: "'variants' must be an array",
      };
    }

    return { success: true };
  }

  instantiateItem(ItemData: InventoryData): Inventory {
    const item = new Inventory(
      ItemData.barcode,
      ItemData.name,
      ItemData.price,
      ItemData.stock,
      new Date(),
      new Date(),
      ItemData.variants,
    );

    return item;
  }
}
