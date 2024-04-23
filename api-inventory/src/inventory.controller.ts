import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { inventoryData } from 'src/entities/inventory.entitie';
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
  @MessagePattern('add_new_item')
  async addItemToInventory(
    @Payload() data: { user_id: string; itemData: inventoryData },
  ) {
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
  @MessagePattern('get_inventory')
  async getInventory(@Payload() user_id: string) {
    const response = await this.inventoryProvider.getInventory(user_id);
    return response;
  }

  /**
   * Handles the update of an item in the inventory.
   *
   * @param data - The data containing the user ID and item data.
   * @returns A Promise that resolves to the response of the update operation.
   */
  @MessagePattern('update_itme')
  async handleUpdateItem(
    @Payload()
    data: {
      user_id: string;
      barcode: string;
      itemData: inventoryData;
    },
  ) {
    const { user_id, barcode, itemData } = data;
    const validate = this.inventoryProvider.validateUpdateItemData(itemData);
    if (!validate.success) {
      return validate;
    }
    const response = await this.inventoryProvider.updateItem(
      user_id,
      barcode,
      itemData,
    );
    return response;
  }

  /**
   * Retrieves an item from the inventory based on its barcode.
   * @param data - The data containing the user ID and barcode.
   * @returns The item from the inventory with the specified barcode.
   */
  @MessagePattern('get_item_by_barcode')
  async getItem(@Payload() data: { user_id: string; barcode: string }) {
    const { user_id, barcode } = data;
    const response = await this.inventoryProvider.getItemByBarcode(
      user_id,
      barcode,
    );
    return response;
  }

  @MessagePattern('get_item_by_barcode_for_order')
  /**
   * Retrieves an item for an order based on the provided user ID and barcode.
   * @param data - The payload containing the user ID and barcode.
   * @returns A Promise that resolves to the response from the inventory provider.
   */
  async getItemForOrder(@Payload() data: { user_id: string; barcode: string }) {
    const { user_id, barcode } = data;
    const response = await this.inventoryProvider.getItemByBarcodeForOrder(
      user_id,
      barcode,
    );
    return response;
  }
}
