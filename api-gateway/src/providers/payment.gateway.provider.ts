import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentProvider {
  constructor(
    @Inject(process.env.PAYMENT_MICROSERVICE_NAME)
    private paymentClient: ClientProxy,
  ) {}

  /**
   * Generates a payment for a user.
   * @param userId - The ID of the user.
   * @param paymentData - The payment data.
   * @param order - The order details.
   * @returns A promise that resolves to the payment result.
   */
  async generatePayment(userId: string, paymentData: any, order: any) {
    const data = {
      user_id: userId,
      paymentData: paymentData,
      order: order,
    };
    return await this.paymentClient.send('payment', data).toPromise();
  }
}
