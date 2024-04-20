import { Injectable } from '@nestjs/common';
import { DatabaseProvider } from 'src/databases/db_connection';
import { Inventory, InventoryData } from 'src/entities/inventory.entitie';

@Injectable()
export class InventoryProvider {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  /**
   * Adds an item to the inventory for a specific user.
   *
   * @param user_id - The ID of the user.
   * @param itemData - The data of the item to be added.
   * @returns A Promise that resolves to an object containing the status, success, and optional message.
   */
  async addItem(
    user_id: string,
    itemData: InventoryData,
  ): Promise<{
    status: number;
    success: boolean;
    message?: string;
  }> {
    const itemInstance = this.instantiateItem(itemData);
    const db = this.databaseProvider.getDb();
    const inventoryCollection = db.collection(`inventory_user_${user_id}`);
    const item = await inventoryCollection.findOne({
      barcode: itemData.barcode,
    });
    if (!item) {
      await inventoryCollection.insertOne(itemInstance);
      return { status: 201, success: true, message: 'Item added successfully' };
    } else {
      return { status: 409, success: false, message: 'Item already exists' };
    }
  }

  /**
   * Retrieves the inventory for a specific user.
   *
   * @param user_id - The ID of the user.
   * @returns A Promise that resolves to an object containing the status, success, message, and inventory data.
   */
  async getInventory(user_id: string): Promise<{
    status: number;
    success: boolean;
    message: string;
    inventory: InventoryData[];
  }> {
    const db = this.databaseProvider.getDb();
    const inventoryCollection = db.collection(`inventory_user_${user_id}`);
    const inventory = await inventoryCollection.find().toArray();
    return {
      status: 200,
      success: true,
      message: 'Items retrieved successfully',
      inventory: inventory as InventoryData[],
    };
  }

  /**
   * Retrieves an item from the inventory for a specific user by barcode.
   *
   * @param user_id - The ID of the user.
   * @param barcode - The barcode of the item.
   * @returns A Promise that resolves to an object containing the status, success, message, and item data.
   */
  async getItemByBarcode(
    user_id: string,
    barcode: string,
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
    item?: InventoryData;
  }> {
    const db = this.databaseProvider.getDb();
    const invetnoryCollection = db.collection(`inventory_user_${user_id}`);
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
   * Validates the item data.
   *
   * @param itemData - The data of the item.
   * @returns An object containing the status, success, and optional message.
   */
  validateNewItemData(itemData: InventoryData): {
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

    return { success: true };
  }

  /**
   * Instantiates an item object from the item data.
   *
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
