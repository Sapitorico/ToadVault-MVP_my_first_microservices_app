import { Controller } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { orderData } from './models/order.model';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * Handles the payment event.
   *
   * @param data - The payment data including user ID, payment data, and order details.
   * @returns A Promise that resolves to the response of the payment handling process.
   */
  @MessagePattern('payment')
  async handlePayment(
    @Payload() data: { user_id: string; paymentData: any; order: orderData },
  ) {
    const { user_id, paymentData, order } = data;
    const validate = this.paymentService.validateCash(paymentData, order);
    if (!validate.success) {
      return validate;
    }
    const response = await this.paymentService.handlePayment(
      user_id,
      paymentData,
      order,
    );
    return response;
  }
}
