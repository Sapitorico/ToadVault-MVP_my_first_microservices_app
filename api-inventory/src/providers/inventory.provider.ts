import { Injectable } from '@nestjs/common';
import { DatabaseProvider } from 'src/databases/db_connection';
import { Inventory, InventoryData } from 'src/entities/inventory.entitie';

@Injectable()
export class InventoryProvider {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  /**
   * Adds an item to the inventory.
   * @param storeId - The ID of the store.
   * @param itemData - The data of the item to be added.
   * @returns A promise that resolves to an object containing the status, success, and optional message.
   */
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

  /**
   * Retrieves the inventory of a store.
   * @param storeId - The ID of the store.
   * @returns A promise that resolves to an object containing the status, success, message, and inventory data.
   */
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

  /**
   * Retrieves an item from the inventory by barcode.
   * @param storeId - The ID of the store.
   * @param barcode - The barcode of the item.
   * @returns A promise that resolves to an object containing the status, success, message, and item data.
   */
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
    const invetnoryCollection = db.collection(`inventory_store_${storeId}`);
    const item = await invetnoryCollection.findOne({
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

  /**
   * Validates the store ID.
   * @param storeId - The ID of the store.
   * @returns An object containing the status, success, and optional message.
   */
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

  /**
   * Validates the item data.
   * @param itemData - The data of the item.
   * @returns An object containing the status, success, and optional message.
   */
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

    return { success: true };
  }

  /**
   * Instantiates an item object from the item data.
   * @param ItemData - The data of the item.
   * @returns An instance of the Inventory class.
   */
  instantiateItem(ItemData: InventoryData): Inventory {
    const item = new Inventory(
      ItemData.barcode,
      ItemData.name,
      ItemData.price,
      ItemData.stock,
      new Date(),
      new Date(),
    );

    return item;
  }
}
