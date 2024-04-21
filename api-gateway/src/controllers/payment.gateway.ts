import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from 'src/guards/auth.gateway.provider';
import { OrderProvider } from 'src/providers/order.gateway.provider';
import { PaymentProvider } from 'src/providers/payment.gateway.provider';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaymentDto, Payment } from 'src/models/payment.model';

@ApiBearerAuth()
@ApiTags('payment')
@Controller('payment')
@UseGuards(AuthGuard)
export class PaymentController {
  constructor(
    private readonly orderProvider: OrderProvider,
    private readonly paymentProvider: PaymentProvider,
  ) {}

  /**
   * Retrieves an item by barcode and processes the payment.
   * @param request - The request object.
   * @param paymentData - The payment data.
   * @param res - The response object.
   * @returns The response with the payment status and any additional information.
   */
  @ApiOperation({ summary: 'Process payment' })
  @ApiResponse({ status: 200, description: 'Payment processed successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 400, description: 'Invalid cash provided' })
  @ApiResponse({ status: 400, description: 'Insufficient cash provided' })
  @ApiBody({ type: PaymentDto, description: 'Payment data' })
  @Post()
  async getItemBybarcode(
    @Req() request,
    @Body() paymentData: Payment,
    @Res() res: Response,
  ) {
    const userId = request.userId;
    const orderResponse = await this.orderProvider.getOrderByUserId(userId);
    if (!orderResponse.success) {
      return res.status(orderResponse.status as number).json({
        success: orderResponse.success,
        message: orderResponse.message,
      });
    }
    const response = await this.paymentProvider.generatePayment(
      userId,
      paymentData,
      orderResponse.order,
    );
    if (response.success) {
      await this.orderProvider.cancelOrder(userId);
    }
    return res.status(response.status as number).json({
      success: response.success,
      message: response.message,
      change: response.change,
    });
  }
}
