import { Controller, Get } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getHello(): string {
    return this.cartService.getHello();
  }
}
