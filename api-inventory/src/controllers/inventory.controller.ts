import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { Response } from 'express';
import { InventoryData } from 'src/entities/inventory.entitie';
import { InventoryProvider } from 'src/providers/inventory.provider';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryProvider: InventoryProvider) {}

  @EventPattern('add_new_item')
  async addItemToInventory(data: { storeId: string; itemData: any }) {
    const { storeId, itemData } = data;
    const validate = this.inventoryProvider.validateItemData(itemData);
    if (!validate.success) {
      return validate;
    }
    const item = this.inventoryProvider.instantiateItem(itemData);
    const response = await this.inventoryProvider.addItem(storeId, item);
    return response;
  }

  @EventPattern('get_inventory')
  async getInventory(storeId: string) {
    const response = await this.inventoryProvider.getInventory(storeId);
    return response;
  }

  @EventPattern('get_item_by_barcode')
  async getItem(data: { storeId: string; barcode: string }) {
    const { storeId, barcode } = data;
    const validate = this.inventoryProvider.validateStore(storeId);
    if (!validate.success) {
      return validate;
    }
    const response = await this.inventoryProvider.getItemByBarcode(
      storeId,
      barcode,
    );
    return response;
  }
}
