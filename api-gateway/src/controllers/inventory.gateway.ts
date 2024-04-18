import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ProductData } from 'src/entities/product.entity';
import { InventoryProvider } from 'src/providers/inventory.gateway.provider';
import { ProductProvider } from 'src/providers/product.gateway.provider';

@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly inventoryProvider: InventoryProvider,
    private readonly productProvider: ProductProvider,
  ) {}

  @Post('new/:storeId')
  async addItem(
    @Param('storeId') storeId: string,
    @Body() itemData: ProductData,
  ) {
    const validate = this.inventoryProvider.validateItemData(itemData);
    if (!validate.success) {
      return validate;
    }
    const productResponse = await this.productProvider.addNewProduct(itemData);
    if (!productResponse.success) {
      return productResponse;
    }
    const newItem = this.inventoryProvider.addItem(
      storeId,
      itemData,
      productResponse.product,
    );
    return newItem;
  }

  @Get(':storeId')
  async getInventory(@Param('storeId') storeId: string) {
    return this.inventoryProvider.getInventory(storeId);
  }

  @Get('item/:storeId/:barcode')
  async getItemBybarcode(
    @Param('storeId') storeId: string,
    @Param('barcode') barcode: string,
  ) {
    const validate = this.inventoryProvider.validateBarcode(barcode);
    if (!validate.success) {
      return validate;
    }
    return this.inventoryProvider.getItemBybarcode(storeId, barcode);
  }
}
