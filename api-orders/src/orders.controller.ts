import { Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { EventPattern } from '@nestjs/microservices';
import { itemData } from './entities/order.entity';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @EventPattern('order')
  async handleCreateOrder(data: { user_id: string; itemData: itemData }) {
    const { user_id, itemData } = data;
    const response = await this.ordersService.createOrder(user_id, itemData);
    return response;
  }

  @EventPattern('remove_item')
  async handleRemoveItem(data: { user_id: string; barcode: string }) {
    const { user_id, barcode } = data;
    const response = await this.ordersService.removeItem(user_id, barcode);
    return response;
  }

  @EventPattern('cancel_order')
  async handleCancelOrder(user_id: string) {
    const response = await this.ordersService.cancelOrder(user_id);
    return response;
  }

  @EventPattern('get_order')
  async handleGetOrder(user_id: string) {
    const response = await this.ordersService.getOrder(user_id);
    return response;
  }
}
