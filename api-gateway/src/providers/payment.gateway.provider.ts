import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentProvider {
  constructor(
    @Inject('payment-microservice') private paymentClient: ClientProxy,
  ) {}

  async generatePayment(userId: string, paymentData: any, order: any) {
    const data = {
      user_id: userId,
      paymentData: paymentData,
      order: order,
    };
    return await this.paymentClient.send('payment', data).toPromise();
  }
}
