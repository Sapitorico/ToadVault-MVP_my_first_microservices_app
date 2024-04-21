import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from 'src/guards/auth.gateway.provider';
import { OrderProvider } from 'src/providers/order.gateway.provider';
import { PaymentProvider } from 'src/providers/payment.gateway.provider';

@Controller('payment')
@UseGuards(AuthGuard)
export class PaymentController {
  constructor(
    private readonly orderProvider: OrderProvider,
    private readonly paymentProvider: PaymentProvider,
  ) {}

  @Get()
  async getItemBybarcode(
    @Req() request,
    @Body() paymentData: any,
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
    return res.status(response.status as number).json({
      success: response.success,
      message: response.message,
      change: response.change,
    });
  }
}
