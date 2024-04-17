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
  }> {
    const db = this.databaseProvider.getDb();
    const productsCollection = db.collection('products');
    const product = await productsCollection.findOne({
      barcode: productData.barcode,
    });
    if (product) {
      return {
        success: false,
        message: 'Product with this barcode already exists',
      };
    }
    await productsCollection.insertOne(productData);
    return { success: true, message: 'Product added successfully' };
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
   * Validates the product data.
   *
   * @param productData - The data of the product to be validated.
   * @returns An object with the following properties:
   *   - success: A boolean indicating if the product data is valid.
   *   - message: An optional string message. If the product data is invalid, the message will indicate the specific validation error.
   */
  validateProductData(productData: ProductData): {
    success: boolean;
    message?: string;
  } {
    const schema = Joi.object({
      barcode: Joi.string()
        .pattern(/^\d+$/)
        .messages({
          'string.pattern.base': "'barcode' must be a string of numbers",
        })
        .required(),
      name: Joi.string().required(),
      description: Joi.string().allow(''),
      category_id: Joi.string().required(),
      variants: Joi.array()
        .items(Joi.object({ name: Joi.string().required() }))
        .min(0),
    });

    const { error } = schema.validate(productData);
    if (error) {
      return { success: false, message: error.details[0].message };
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
      productData.description,
      productData.category_id,
      new Date(),
      new Date(),
      productData.variants,
    );

    return product;
  }
}
