export interface itemsListData {
  barcode: string;
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface orderData {
  items: itemsListData[];
  total: number;
}
