import { ObjectId } from 'mongodb';

export interface InventoryData {
  _id?: ObjectId;
  barcode: string;
  name: string;
  price?: number;
  stock?: number;
  created_at?: Date;
  updated_at?: Date;
}

/**
 * Represents an inventory item.
 *
 * @param barcode - The barcode of the item.
 * @param name - The name of the item.
 * @param price - The price of the item.
 * @param stock - The stock quantity of the item.
 * @param created_at - The date and time when the item was created.
 * @param updated_at - The date and time when the item was last updated.
 */
export class Inventory implements InventoryData {
  constructor(
    public barcode: string,
    public name: string,
    public price: number = 0,
    public stock: number = 0,
    public created_at: Date,
    public updated_at: Date,
  ) {}
}
