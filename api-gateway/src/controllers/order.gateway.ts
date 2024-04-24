import {
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from 'src/guards/auth.gateway.provider';
import { OrderProvider } from 'src/providers/order.gateway.provider';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { InventoryProvider } from 'src/providers/inventory.gateway.provider';

@ApiBearerAuth()
@ApiTags('order')
@Controller('order')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(
    private readonly orderProvider: OrderProvider,
    private readonly inventoryProvider: InventoryProvider,
  ) {}

  /**
   * Create an order for a given barcode.
   * @param request - The request object.
   * @param barcode - The barcode of the item.
   * @param res - The response object.
   * @returns The response with the order details.
   */
  @ApiOperation({ summary: 'Create order for item' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 200, description: 'Order updated successfully' })
  @ApiResponse({ status: 400, description: 'Insufficient stock' })
  @ApiResponse({
    status: 404,
    description: 'Item does not have price or stock greater than 0',
  })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @Get(':barcode')
  async createOrder(
    @Req() request,
    @Param('barcode') barcode: string,
    @Res() res: Response,
  ) {
    const userId = request.userId;
    const inventoryResponse =
      await this.inventoryProvider.getItemBybarcodeFromOrder(userId, barcode);
    if (!inventoryResponse.success) {
      return res.status(inventoryResponse.status as number).json({
        success: inventoryResponse.success,
        message: inventoryResponse.message,
        item: inventoryResponse.item,
      });
    }

    const response = await this.orderProvider.generateOrder(
      userId,
      inventoryResponse.item,
    );
    return res.status(response.status as number).json({
      success: response.success,
      message: response.message,
      order: response.order,
    });
  }

  /**
   * Remove an item from the order.
   * @param request - The request object.
   * @param barcode - The barcode of the item to remove.
   * @param res - The response object.
   * @returns The response with the updated order details.
   */
  @ApiOperation({ summary: 'Remove item from order' })
  @ApiResponse({ status: 200, description: 'Item removed successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @Put('remove/:barcode')
  async removeItem(
    @Req() request,
    @Param('barcode') barcode: string,
    @Res() res: Response,
  ) {
    const userId = request.userId;
    const response = await this.orderProvider.removeItem(userId, barcode);
    return res.status(response.status as number).json({
      success: response.success,
      message: response.message,
      order: response.order,
    });
  }

  /**
   * Cancel the order.
   * @param request - The request object.
   * @param res - The response object.
   * @returns The response with the cancellation status.
   */
  @ApiOperation({ summary: 'Cancel order' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @Delete()
  async cancelOrder(@Req() request, @Res() res: Response) {
    const userId = request.userId;
    const response = await this.orderProvider.cancelOrder(userId);
    return res.status(response.status as number).json({
      success: response.success,
      message: response.message,
    });
  }
}
