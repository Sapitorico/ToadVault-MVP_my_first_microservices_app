import { ObjectId } from 'mongodb';

export interface ProductData {
  _id?: ObjectId;
  barcode: string;
  name: string;
  description: string;
  category_id: string;
  created_at: Date;
  updated_at: Date;
  variants: Variant[];
}

export class Product implements ProductData {
  constructor(
    public barcode: string,
    public name: string,
    public description: string,
    public category_id: string,
    public created_at: Date,
    public updated_at: Date,
    public variants: Variant[],
  ) {}
}

export interface VariantData {
  name: string;
}

export class Variant implements VariantData {
  constructor(public name: string) {}
}
