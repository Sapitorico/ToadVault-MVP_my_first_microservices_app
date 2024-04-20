import { Injectable } from '@nestjs/common';
import { DatabaseProvider } from 'src/databases/db_connection';
import { Product, productData } from 'src/entities/product.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class ProductProvider {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  /**
   * Adds a new product to the database.
   * @param productData - The data of the product to be added.
   * @returns A promise that resolves to an object containing the status, success, message, and product data.
   */
  async addProduct(productData: Product): Promise<{
    status: number;
    success: boolean;
    message?: string;
    product?: productData;
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
      product: newProduct as productData,
    };
  }

  /**
   * Retrieves all products from the database.
   * @returns A promise that resolves to an object containing the status, success, message, and array of product data.
   */
  async getProdcuts(): Promise<{
    status: number;
    success: boolean;
    message: string;
    products: productData[];
  }> {
    const db = this.databaseProvider.getDb();
    const productsCollection = db.collection('products');
    const products = await productsCollection.find().toArray();
    return {
      status: 200,
      success: true,
      message: 'Products retrieved successfully',
      products: products as productData[],
    };
  }

  /**
   * Updates a product in the database.
   * @param id - The ID of the product to be updated.
   * @param productData - The updated data of the product.
   * @returns A promise that resolves to an object containing the status, success, and message.
   */
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

  /**
   * Retrieves a product from the database by its barcode.
   * @param barcode - The barcode of the product to be retrieved.
   * @returns A promise that resolves to an object containing the status, success, message, and product data.
   */
  async getProductByBarcode(barcode: string): Promise<{
    status: number;
    success: boolean;
    message: string;
    product?: productData;
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
      product: { ...product } as productData,
    };
  }

  /**
   * Verifies if a barcode is valid.
   * @param barcode - The barcode to be verified.
   * @returns An object containing the success status and an optional message.
   */
  verifyBarcode(barcode: string): { success: boolean; message?: string } {
    if (!barcode || barcode.trim() == '') {
      return { success: false, message: 'Product requires a barcode' };
    }
    return { success: true };
  }

  /**
   * Validates the data of a product.
   * @param productData - The data of the product to be validated.
   * @returns An object containing the success status and an optional message.
   */
  validateProductData(productData: productData): {
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

    return { success: true };
  }

  /**
   * Instantiates a new Product object.
   * @param productData - The data of the product to be instantiated.
   * @returns The instantiated Product object.
   */
  instantiateProduct(productData: productData): Product {
    const product = new Product(
      productData.barcode,
      productData.name,
      new Date(),
      new Date(),
    );

    return product;
  }
}
