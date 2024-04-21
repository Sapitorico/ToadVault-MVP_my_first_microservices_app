import { Controller } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { EventPattern } from '@nestjs/microservices';
import { orderData } from './models/order.model';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @EventPattern('payment')
  async handlePayment(data: {
    user_id: string;
    paymentData: any;
    order: orderData;
  }) {
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
