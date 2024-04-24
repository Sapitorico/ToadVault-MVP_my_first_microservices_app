export interface itemsData {
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export class Payment {
  constructor(
    private items: itemsData[],
    private amount: number,
    private created_at: Date,
  ) {}
}
