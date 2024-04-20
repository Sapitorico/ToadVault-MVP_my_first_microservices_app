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
import { inventoryData } from 'src/models/inventory.model';

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
   * @param request - The request object.
   * @param itemData - The data of the item to be added.
   * @param res - The response object.
   * @returns The response with success status, message, and item details.
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

  /**
   * Updates an item in the inventory.
   *
   * @param request - The request object.
   * @param barcode - The barcode of the item to update.
   * @param itemData - The updated item data.
   * @param res - The response object.
   * @returns The updated item details.
   */
  @Post('update/:barcode')
  async updateItem(
    @Req() request,
    @Param('barcode') barcode: string,
    @Body() itemData: inventoryData,
    @Res() res: Response,
  ) {
    const userId = request.userId;
    const response = await this.inventoryProvider.updateItem(
      userId,
      barcode,
      itemData,
    );
    return res.status(response.status as number).json({
      success: response.success,
      message: response.message,
    });
  }

  /**
   * Get the inventory for the user.
   * @param request - The request object.
   * @param res - The response object.
   * @returns The response with success status, message, and inventory items.
   */
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
   * @param request - The request object.
   * @param barcode - The barcode of the item.
   * @param res - The response object.
   * @returns The response with success status, message, and item details.
   */
  @Get('item/:barcode')
  async getItemBybarcode(
    @Req() request,
    @Param('barcode') barcode: string,
    @Res() res: Response,
  ) {
    const userId = request.userId;
    const response = await this.inventoryProvider.getItemBybarcode(
      userId,
      barcode,
    );
    return res.status(response.status as number).json({
      success: response.success,
      message: response.message,
      item: response.item,
    });
  }
}
