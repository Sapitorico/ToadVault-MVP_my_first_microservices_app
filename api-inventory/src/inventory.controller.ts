import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { InventoryData } from 'src/entities/inventory.entitie';
import { InventoryProvider } from 'src/inventory.provider';

/**
 * Controller for managing inventory operations.
 */
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryProvider: InventoryProvider) {}

  /**
   * Adds a new item to the inventory.
   * @param data - The data containing the user ID and item data.
   * @returns The response from adding the item to the inventory.
   */
  @EventPattern('add_new_item')
  async addItemToInventory(data: { user_id: string; itemData: InventoryData }) {
    const { user_id, itemData } = data;
    const validate = this.inventoryProvider.validateNewItemData(itemData);
    if (!validate.success) {
      return validate;
    }
    const response = await this.inventoryProvider.addItem(user_id, itemData);
    return response;
  }

  /**
   * Retrieves the inventory for a specific user.
   * @param user_id - The ID of the user.
   * @returns The inventory for the specified user.
   */
  @EventPattern('get_inventory')
  async getInventory(user_id: string) {
    const response = await this.inventoryProvider.getInventory(user_id);
    return response;
  }

  /**
   * Retrieves an item from the inventory based on its barcode.
   * @param data - The data containing the user ID and barcode.
   * @returns The item from the inventory with the specified barcode.
   */
  @EventPattern('get_item_by_barcode')
  async getItem(data: { user_id: string; barcode: string }) {
    const { user_id, barcode } = data;
    const response = await this.inventoryProvider.getItemByBarcode(
      user_id,
      barcode,
    );
    return response;
  }
}
