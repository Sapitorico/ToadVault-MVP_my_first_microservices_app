import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { Response } from 'express';
import { InventoryData } from 'src/entities/inventory.entitie';
import { InventoryProvider } from 'src/providers/inventory.provider';

/**
 * The InventoryController class handles the HTTP requests related to inventory management.
 */
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryProvider: InventoryProvider) {}

  /**
   * Adds an item to the inventory of a specific store.
   *
   * @param storeId - The ID of the store where the item will be added.
   * @param inventoryData - The data of the item to be added to the inventory.
   * @param res - The response object used to send the HTTP response.
   * @returns The response object with the status and data of the added item.
   */
  @EventPattern('add_new_item')
  async addItemToInventory(data: any) {
    const storeId = data.storeId;
    const inventoryData = data.itemData;
    const validate = this.inventoryProvider.validateItemData(inventoryData);
    console.log(validate);
    if (!validate.success) {
      return validate;
    }
    const item = this.inventoryProvider.instantiateItem(inventoryData);
    const response = await this.inventoryProvider.addItem(storeId, item);
    return response;
  }

  /**
   * Retrieves the inventory of a specific store.
   *
   * @param storeId - The ID of the store to retrieve the inventory from.
   * @param res - The response object used to send the HTTP response.
   * @returns The response object with the status and data of the inventory.
   */
  @EventPattern('get_inventory')
  async getInventory(storeId: string) {
    const response = await this.inventoryProvider.getInventory(storeId);
    return response;
  }

  /**
   * Retrieves an item from the inventory based on the barcode ID.
   *
   * @param barcode_id - The barcode ID of the item to retrieve.
   * @param storeInfo - Additional information about the store.
   * @param res - The response object used to send the HTTP response.
   * @returns The response object with the status and data of the retrieved item.
   */
  @EventPattern('get_item_by_barcode')
  async getItem(data: any) {
    const storeId = data.storeId;
    const barcode = data.barcode;
    const validate = this.inventoryProvider.validateStore(storeId);
    if (!validate.success) {
      return validate;
    }
    const response = await this.inventoryProvider.getItemByBarcodeOrID(
      storeId,
      barcode,
    );
    return response;
  }
}
