import { Injectable } from '@nestjs/common';
import { DatabaseProvider } from 'src/databases/db_connection';
import { Product, ProductData } from 'src/entities/product.entity';
import * as Joi from 'joi';
import { ObjectId } from 'mongodb';

@Injectable()
export class ProductProvider {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  async addProduct(productData: Product): Promise<{
    status: number;
    success: boolean;
    message?: string;
    product?: ProductData;
  }> {
    const db = this.databaseProvider.getDb();
    const productsCollection = db.collection('products');
    const product = await productsCollection.findOne({
      barcode: productData.barcode,
    });
    if (product) {
      return {
        status: 409,
        success: false,
        message: 'The product with this barcode already exists in the database',
        product: {} as ProductData,
      };
    }
    const insertResult = await productsCollection.insertOne(productData);
    const newProduct = await productsCollection.findOne({
      _id: insertResult.insertedId,
    });
    return {
      status: 201,
      success: true,
      message: 'Product added successfully',
      product: newProduct as ProductData,
    };
  }

  async getProdcuts(): Promise<{
    status: number;
    success: boolean;
    message: string;
    products: ProductData[];
  }> {
    const db = this.databaseProvider.getDb();
    const productsCollection = db.collection('products');
    const products = await productsCollection.find().toArray();
    return {
      status: 200,
      success: true,
      message: 'Products retrieved successfully',
      products: products as ProductData[],
    };
  }

  async updateProduct(
    id: string,
    productData: Product,
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
  }> {
    if (!ObjectId.isValid(id)) {
      return {
        status: 404,
        success: false,
        message: 'Product not found',
      };
    }
    const db = this.databaseProvider.getDb();
    const productsCollection = db.collection('products');
    const product = await productsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!product) {
      return {
        status: 404,
        success: false,
        message: 'Product not found',
      };
    }
    await productsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: productData },
    );
    return {
      status: 200,
      success: true,
      message: 'Product updated successfully',
    };
  }

  async getProductByBarcode(barcode: string): Promise<{
    status: number;
    success: boolean;
    message: string;
    product?: ProductData;
  }> {
    const db = this.databaseProvider.getDb();
    const productsCollection = db.collection('products');
    const product = await productsCollection.findOne({
      barcode: barcode,
    });
    if (!product) {
      return {
        status: 404,
        success: false,
        message: 'Product not found',
      };
    }
    return {
      status: 200,
      success: true,
      message: 'Product retrieved successfully',
      product: { ...product } as ProductData,
    };
  }

  verifyBarcode(barcode: string): { success: boolean; message?: string } {
    if (!barcode && barcode.trim() == '') {
      return { success: false, message: 'Product requires a barcode' };
    }
    return { success: true };
  }

  validateProductData(productData: ProductData): {
    success: boolean;
    message?: string;
  } {
    if (
      typeof productData.barcode !== 'string' ||
      !/^\d+$/.test(productData.barcode)
    ) {
      return {
        success: false,
        message: "'barcode' must be a string of numbers",
      };
    }

    if (typeof productData.name !== 'string') {
      return { success: false, message: "'name' must be a string" };
    }

    if (Array.isArray(productData.variants)) {
      for (let variant of productData.variants) {
        if (typeof variant.name !== 'string') {
          return { success: false, message: "'variant.name' must be a string" };
        }
      }
    } else {
      return { success: false, message: "'variants' must be an array" };
    }

    return { success: true };
  }

  /**
   * Instantiates a new Product object based on the provided product data.
   *
   * @param productData - The data of the product to be instantiated.
   * @returns A new Product object.
   */
  instantiateProduct(productData: ProductData): Product {
    const product = new Product(
      productData.barcode,
      productData.name,
      new Date(),
      new Date(),
      productData.variants,
    );

    return product;
  }
}
