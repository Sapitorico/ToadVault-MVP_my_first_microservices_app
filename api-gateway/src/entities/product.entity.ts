export interface ProductData {
  barcode: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  variants: Variant[];
}

/**
 * Represents a product.
 *
 * @property {string} barcode - The barcode of the product.
 * @property {string} name - The name of the product.
 * @property {Date} created_at - The creation date of the product.
 * @property {Date} updated_at - The last update date of the product.
 * @property {Variant[]} variants - The variants of the product.
 */
export class Product implements ProductData {
  constructor(
    public barcode: string,
    public name: string,
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
