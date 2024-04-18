import { Injectable } from '@nestjs/common';
import { DatabaseProvider } from 'src/databases/db_connection';
import { Product, ProductData } from 'src/entities/product.entity';
import * as Joi from 'joi';
import { ObjectId } from 'mongodb';

/**
 * ProductProvider class is responsible for handling product-related operations.
 * It interacts with the DatabaseProvider class to perform CRUD operations on the 'products' collection in the database.
 *
 * @class
 * @public
 * @constructor
 * @param {DatabaseProvider} databaseProvider - An instance of the DatabaseProvider class.
 */
@Injectable()
export class ProductProvider {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  /**
   * Adds a new product to the database.
   *
   * @param productData - The data of the product to be added.
   * @returns A promise that resolves to an object with the following properties:
   *   - success: A boolean indicating if the product was added successfully.
   *   - message: An optional string message. If the product already exists, the message will indicate that.
   */
  async addProduct(productData: Product): Promise<{
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
      success: true,
      message: 'Product added successfully',
      product: newProduct as ProductData,
    };
  }

  /**
   * Retrieves all products from the database.
   *
   * @returns A promise that resolves to an object with the following properties:
   *   - success: A boolean indicating if the products were retrieved successfully.
   *   - message: A string message indicating the status of the retrieval.
   *   - products: An array of ProductData objects representing the retrieved products.
   */
  async getProdcuts(): Promise<{
    success: boolean;
    message: string;
    products: ProductData[];
  }> {
    const db = this.databaseProvider.getDb();
    const productsCollection = db.collection('products');
    const products = await productsCollection.find().toArray();
    return {
      success: true,
      message: 'Products retrieved successfully',
      products: products as ProductData[],
    };
  }

  /**
   * Updates a product in the database.
   *
   * @param id - The ID of the product to be updated.
   * @param productData - The updated data of the product.
   * @returns A promise that resolves to an object with the following properties:
   *   - success: A boolean indicating if the product was updated successfully.
   *   - message: A string message indicating the status of the update.
   */
  async updateProduct(
    id: string,
    productData: Product,
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    if (!ObjectId.isValid(id)) {
      return {
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
        success: false,
        message: 'Product not found',
      };
    }
    await productsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: productData },
    );
    return {
      success: true,
      message: 'Product updated successfully',
    };
  }

  /**
   * Retrieves a product from the database by barcode or ID.
   *
   * @param barcode_id - The barcode or ID of the product to retrieve.
   * @returns A promise that resolves to an object with the following properties:
   *   - success: A boolean indicating if the product was retrieved successfully.
   *   - message: A string message indicating the status of the retrieval.
   *   - product: An optional ProductData object representing the retrieved product.
   */
  async getProductByBarcodeOrID(barcode_id: string): Promise<{
    success: boolean;
    message: string;
    product?: ProductData;
  }> {
    const db = this.databaseProvider.getDb();
    const productsCollection = db.collection('products');
    if (!ObjectId.isValid(barcode_id)) {
      const product = await productsCollection.findOne({
        barcode: barcode_id,
      });
      if (!product) {
        return {
          success: false,
          message: 'Product not found',
        };
      }
      return {
        success: true,
        message: 'Product retrieved successfully',
        product: { ...product } as ProductData,
      };
    }
    const product = await productsCollection.findOne({
      _id: new ObjectId(barcode_id),
    });
    if (!product) {
      return {
        success: false,
        message: 'Product not found',
      };
    }
    return {
      success: true,
      message: 'Product retrieved successfully',
      product: { ...product } as ProductData,
    };
  }

  /**
   * Verifies if the product data contains a barcode or an id and returns the one that has a value.
   *
   * @param productData - The data of the product to be verified.
   * @returns The barcode or id of the product if it has a value, or an object with success: false and a message otherwise.
   */
  getBarcodeOrId(
    itemData: any,
  ): string | { success: boolean; message: string } {
    if (itemData.barcode && itemData.barcode.trim() !== '') {
      return itemData.barcode;
    } else if (itemData.id && itemData.id.trim() !== '') {
      return itemData.id;
    } else {
      return { success: false, message: 'Product requires a barcode or id.' };
    }
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
