import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
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
  @Post(':storeId')
  async addItemToInventory(
    @Param('storeid') storeId: string,
    @Body() inventoryData: InventoryData,
    @Res() res: Response,
  ) {
    const validate = this.inventoryProvider.validateItemData(inventoryData);
    if (!validate.success) {
      return res.status(400).json(validate);
    }
    const item = this.inventoryProvider.instantiateItem(inventoryData);
    const response = await this.inventoryProvider.addItem(storeId, item);
    return res.status(201).json(response);
  }

  /**
   * Retrieves the inventory of a specific store.
   *
   * @param storeId - The ID of the store to retrieve the inventory from.
   * @param res - The response object used to send the HTTP response.
   * @returns The response object with the status and data of the inventory.
   */
  @Get(':storeId')
  async getInventory(@Param('storeId') storeId: string, @Res() res: Response) {
    const response = await this.inventoryProvider.getInventory(storeId);
    res.status(200).json(response);
  }

  /**
   * Retrieves an item from the inventory based on the barcode ID.
   *
   * @param barcode_id - The barcode ID of the item to retrieve.
   * @param storeInfo - Additional information about the store.
   * @param res - The response object used to send the HTTP response.
   * @returns The response object with the status and data of the retrieved item.
   */
  @Get('item/:barcode_id')
  async getItem(
    @Param('barcode_id') barcode_id: string,
    @Body() storeInfo: any,
    @Res() res: Response,
  ) {
    const validate = this.inventoryProvider.validateStore(storeInfo);
    if (!validate.success) {
      return res.status(400).json(validate);
    }
    const response = await this.inventoryProvider.getItemByBarcodeOrID(
      storeInfo.store_id,
      barcode_id,
    );
    return res.status(200).json(response);
  }
}
