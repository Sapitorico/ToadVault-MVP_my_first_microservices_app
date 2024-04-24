import { Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { itemData } from './entities/order.entity';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Handles the creation of a new order.
   * @param data - The data containing the user ID and item data.
   * @returns The response from the orders service.
   */
  @MessagePattern('order')
  async handleCreateOrder(
    @Payload() data: { user_id: string; itemData: itemData },
  ) {
    const { user_id, itemData } = data;
    const response = await this.ordersService.createOrder(user_id, itemData);
    return response;
  }

  /**
   * Handles the removal of an item from an order.
   * @param data - The data containing the user ID and barcode of the item to be removed.
   * @returns The response from the orders service.
   */
  @MessagePattern('remove_item')
  async handleRemoveItem(
    @Payload() data: { user_id: string; barcode: string },
  ) {
    const { user_id, barcode } = data;
    const response = await this.ordersService.removeItem(user_id, barcode);
    return response;
  }

  /**
   * Handles the cancellation of an order.
   * @param user_id - The ID of the user whose order needs to be cancelled.
   * @returns The response from the orders service.
   */
  @MessagePattern('cancel_order')
  async handleCancelOrder(@Payload() user_id: string) {
    const response = await this.ordersService.cancelOrder(user_id);
    return response;
  }

  /**
   * Handles the retrieval of an order.
   * @param user_id - The ID of the user whose order needs to be retrieved.
   * @returns The response from the orders service.
   */
  @MessagePattern('get_order')
  async handleGetOrder(@Payload() user_id: string) {
    const response = await this.ordersService.getOrder(user_id);
    return response;
  }
}
