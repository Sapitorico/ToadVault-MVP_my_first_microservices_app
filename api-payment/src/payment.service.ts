import { Injectable } from '@nestjs/common';
import { orderData } from './models/order.model';
import { DatabaseService } from './databases/db_connection';
import { Payment } from './entities/payment.entities';

@Injectable()
export class PaymentService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Handles the payment process.
   * @param user_id - The ID of the user making the payment.
   * @param paymentData - The payment data.
   * @param order - The order data.
   * @returns A promise that resolves to an object containing the payment status, success flag, message, and change amount.
   */
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

  /**
   * Validates the cash provided for the payment.
   * @param paymentData - The payment data.
   * @param order - The order data.
   * @returns An object containing the validation status, success flag, and optional message.
   */
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

  /**
   * Instantiates a Payment object.
   * @param orderData - The order data.
   * @returns A new Payment instance.
   */
  instantiatePayment(orderData: orderData): Payment {
    return new Payment(orderData.items, orderData.total, new Date());
  }
}
