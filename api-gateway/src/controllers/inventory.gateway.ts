import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { InventoryProvider } from 'src/providers/inventory.gateway.provider';
import { ProductProvider } from 'src/providers/product.gateway.provider';
import { AuthGuard } from 'src/guards/auth.gateway.provider';
import { productData } from 'src/models/product.model';

/**
 * Controller for managing inventory-related operations.
 */
@Controller('inventory')
@UseGuards(AuthGuard)
export class InventoryController {
  constructor(
    private readonly inventoryProvider: InventoryProvider,
    private readonly productProvider: ProductProvider,
  ) {}

  /**
   * Add a new item to the inventory.
   * @param storeId - The ID of the store.
   * @param itemData - The data of the item to be added.
   * @param res - The response object.
   * @returns The response with success status, message, and added item details.
   */
  @Post('new')
  async addItem(
    @Req() request,
    @Body() itemData: productData,
    @Res() res: Response,
  ) {
    const userId = request.userId;
    const productResponse = await this.productProvider.addNewProduct(itemData);
    if (!productResponse.success) {
      return res.status(productResponse.status as number).json({
        success: productResponse.success,
        message: productResponse.message,
      });
    }
    const response = await this.inventoryProvider.addItem(
      userId,
      productResponse.product,
    );
    return res.status(response.status as number).json({
      success: response.success,
      message: response.message,
    });
  }

  @Get()
  async getInventory(@Req() request, @Res() res: Response) {
    const userId = request.userId;
    const response = await this.inventoryProvider.getInventory(userId);
    return res.status(response.status as number).json({
      success: response.success,
      message: response.message,
      items: response.inventory,
    });
  }

  /**
   * Get an item from the inventory by barcode.
   * @param storeId - The ID of the store.
   * @param barcode - The barcode of the item.
   * @param res - The response object.
   * @returns The response with success status, message, and item details.
   */
  @Get('item/:storeId/:barcode')
  async getItemBybarcode(
    @Param('storeId') storeId: string,
    @Param('barcode') barcode: string,
    @Res() res: Response,
  ) {
    const response = await this.inventoryProvider.getItemBybarcode(
      storeId,
      barcode,
    );
    return res.status(response.status as number).json({
      success: response.success,
      message: response.message,
      item: response.item,
    });
  }
}
