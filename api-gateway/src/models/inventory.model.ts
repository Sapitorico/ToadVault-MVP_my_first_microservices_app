export interface inventoryData {
  _id?: string;
  barcode: string;
  name: string;
  price?: number;
  stock?: number;
  created_at: Date;
  updated_at: Date;
}
