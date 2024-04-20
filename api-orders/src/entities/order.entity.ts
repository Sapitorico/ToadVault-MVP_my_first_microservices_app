export interface itemData {
  barcode: string;
  name: string;
  price: number;
}

export class ItemsList {
  public totalPrice: number;

  constructor(
    public barcode: string,
    public name: string,
    public unitPrice: number,
    public quantity: number,
  ) {
    this.totalPrice = this.unitPrice * this.quantity;
  }
}

export class Order {
  constructor(
    public items: ItemsList[],
    public total: number,
  ) {}
}
