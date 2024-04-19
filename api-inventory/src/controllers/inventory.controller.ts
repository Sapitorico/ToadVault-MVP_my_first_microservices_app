import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { InventoryProvider } from 'src/providers/inventory.provider';

/**
 * Controller for managing inventory operations.
 */
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryProvider: InventoryProvider) {}

  /**
   * Adds a new item to the inventory.
   * @param data - The data containing the store ID and item data.
   * @returns The response from adding the item to the inventory.
   */
  @EventPattern('add_new_item')
  async addItemToInventory(data: { storeId: string; itemData: any }) {
    const { storeId, itemData } = data;
    const validate = this.inventoryProvider.validateItemData(itemData);
    if (!validate.success) {
      return validate;
    }
    const item = this.inventoryProvider.instantiateItem(itemData);
    const response = await this.inventoryProvider.addItem(storeId, item);
    return response;
  }

  /**
   * Retrieves the inventory for a specific store.
   * @param storeId - The ID of the store.
   * @returns The inventory for the specified store.
   */
  @EventPattern('get_inventory')
  async getInventory(storeId: string) {
    const response = await this.inventoryProvider.getInventory(storeId);
    return response;
  }

  /**
   * Retrieves an item from the inventory based on its barcode.
   * @param data - The data containing the store ID and barcode.
   * @returns The item with the specified barcode from the inventory.
   */
  @EventPattern('get_item_by_barcode')
  async getItem(data: { storeId: string; barcode: string }) {
    const { storeId, barcode } = data;
    const validate = this.inventoryProvider.validateStore(storeId);
    if (!validate.success) {
      return validate;
    }
    const response = await this.inventoryProvider.getItemByBarcode(
      storeId,
      barcode,
    );
    return response;
  }
}
