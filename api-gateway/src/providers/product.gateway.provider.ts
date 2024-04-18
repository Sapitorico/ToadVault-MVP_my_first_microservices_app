import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inventory, InventoryData } from 'src/entities/inventory.entitie';
import { Product, ProductData } from 'src/entities/product.entity';

interface newItem {
  barcode: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}
@Injectable()
export class ProductProvider {
  constructor(
    @Inject('product-microservice') private productClient: ClientProxy,
  ) {}

  async addNewProduct(productData: ProductData) {
    const product = this.instantiateProduct(productData);
    const response = await this.productClient
      .send('add_new_product', product)
      .toPromise();
    return response;
  }

  instantiateProduct(prodcutData: ProductData): Product {
    const item = new Product(
      prodcutData.barcode,
      prodcutData.name,
      new Date(),
      new Date(),
      prodcutData.variants,
    );

    return item;
  }
}
