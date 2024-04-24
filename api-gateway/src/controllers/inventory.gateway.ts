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
import {
  NewItemDto,
  UpdateItemDto,
  inventoryData,
} from 'src/models/inventory.model';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

/**
 * Controller for managing inventory-related operations.
 */
@ApiBearerAuth()
@ApiTags('inventory')
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
  @ApiOperation({ summary: 'Add new item to inventory' })
  @ApiResponse({ status: 201, description: 'Created successfully.' })
  @ApiResponse({ status: 400, description: 'Missing fields.' })
  @ApiResponse({ status: 409, description: 'Item already exists.' })
  @ApiBody({
    type: NewItemDto,
    description: 'Json structure for item object',
  })
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
  @ApiOperation({ summary: 'Update item in inventory' })
  @ApiResponse({ status: 200, description: 'Updated successfully.' })
  @ApiResponse({ status: 400, description: 'Missing fields.' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @ApiBody({
    type: UpdateItemDto,
    description: 'Json structure for item object',
  })
  @Put('update/:barcode')
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
  @ApiOperation({ summary: 'Get inventory' })
  @ApiResponse({
    status: 200,
    description: 'Inventory retrieved successfully.',
  })
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
  @ApiOperation({ summary: 'Get item by barcode' })
  @ApiResponse({ status: 200, description: 'Item retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Item not found' })
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
