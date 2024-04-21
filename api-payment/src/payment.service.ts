import { Injectable } from '@nestjs/common';
import { orderData } from './models/order.model';
import { DatabaseService } from './databases/db_connection';
import { Payment } from './entities/payment.entities';

@Injectable()
export class PaymentService {
  constructor(private readonly databaseService: DatabaseService) {}

  async handlePayment(
    user_id: string,
    paymentData: any,
    order: orderData,
  ): Promise<{
    status?: number;
    success?: boolean;
    message?: string;
    change?: number;
  }> {
    const paymentInstance = this.instantiatePayment(order);
    const db = this.databaseService.getDb();
    const paymentCollection = db.collection(`payments_user_${user_id}`);
    await paymentCollection.insertOne(paymentInstance);
    return {
      status: 200,
      success: true,
      message: 'Payment success',
      change: paymentData.cash - order.total,
    };
  }

  validateCash(
    paymentData,
    order,
  ): { status?: number; success: boolean; message?: string } {
    if (typeof paymentData.cash !== 'number') {
      return {
        status: 400,
        success: false,
        message: 'Invalid cash provided',
      };
    }
    if (paymentData.cash < order.total) {
      return {
        status: 400,
        success: false,
        message: 'Insufficient cash provided',
      };
    }
    return {
      success: true,
    };
  }

  instantiatePayment(orderData: orderData): Payment {
    return new Payment(orderData.items, orderData.total, new Date());
  }
}
