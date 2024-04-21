import {
  Body,
  Controller,
  Delete,
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
import { OrderProvider } from 'src/providers/order.gateway.provider';

@Controller('order')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(
    private readonly inventoryProvider: InventoryProvider,
    private readonly orderProvider: OrderProvider,
  ) {}

  @Get(':barcode')
  async createOrder(
    @Req() request,
    @Param('barcode') barcode: string,
    @Res() res: Response,
  ) {
    const userId = request.userId;
    const inventoryResponse = await this.inventoryProvider.getItemBybarcode(
      userId,
      barcode,
    );
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

  @Get('remove/:barcode')
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
