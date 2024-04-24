import { Injectable } from '@nestjs/common';
import { DatabaseService } from './databases/db_connection';
import { ItemsList, Order, itemData } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Creates a new order for a user with the provided item data.
   * @param user_id - The ID of the user.
   * @param itemData - The data of the item to be added to the order.
   * @returns A promise that resolves to an object containing the status, success, message, and order details.
   */
  async createOrder(
    user_id: string,
    itemData: itemData,
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
    order: any;
  }> {
    const db = this.databaseService.getDb();
    const orderCollection = db.collection(`orders_user_${user_id}`);
    // Busca una orden existente
    const existingOrder = await orderCollection.findOne({});
    if (!existingOrder) {
      //Si no existe una orden, crea una nueva
      const orderInstance = this.instantiateOrder(itemData);
      await orderCollection.insertOne(orderInstance);
      const newOrder = await orderCollection.findOne({});
      return {
        status: 201,
        success: true,
        message: 'Order created successfully',
        order: newOrder,
      };
    }
    //Si existe una orden, añade o actualiza el producto
    const itemIndex = existingOrder.items.findIndex(
      (item) => item.barcode === itemData.barcode,
    );
    if (itemIndex === -1) {
      // Si el producto no está en la orden, añádelo
      const orderInstance = this.instanciateItem(itemData);
      existingOrder.items.push(orderInstance);
    } else {
      // Si el producto está en la orden, incrementa la cantidad\
      if (itemData.stock > existingOrder.items[itemIndex].quantity) {
        existingOrder.items[itemIndex].quantity += 1;
        existingOrder.items[itemIndex].totalPrice =
          existingOrder.items[itemIndex].unitPrice *
          existingOrder.items[itemIndex].quantity;
      } else {
        return {
          status: 400,
          success: false,
          message: 'Insufficient stock',
          order: existingOrder,
        };
      }
    }
    // Actualiza el precio total
    existingOrder.total = existingOrder.items.reduce(
      (total, item) => total + item.totalPrice,
      0,
    );
    // Actualiza la orden en la base de datos
    await orderCollection.updateOne({}, { $set: existingOrder });
    const updatedOrder = await orderCollection.findOne({});
    return {
      status: 200,
      success: true,
      message: 'Order updated successfully',
      order: updatedOrder,
    };
  }

  /**
   * Removes an item from the order.
   *
   * @param user_id - The ID of the user.
   * @param barcode - The barcode of the item to be removed.
   * @returns A promise that resolves to an object containing the status, success, message, and updated order (if successful).
   */
  async removeItem(
    user_id: string,
    barcode: string,
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
    order?: any;
  }> {
    const db = this.databaseService.getDb();
    const orderCollection = db.collection(`orders_user_${user_id}`);
    const order = await orderCollection.findOne({});
    if (!order) {
      return {
        status: 404,
        success: false,
        message: 'Order not found',
      };
    }
    const itemIndex = order.items.findIndex((item) => item.barcode === barcode);
    if (itemIndex === -1) {
      return {
        status: 404,
        success: false,
        message: 'Item not found',
      };
    }
    if (order.items[itemIndex].quantity > 1) {
      order.items[itemIndex].quantity -= 1;
      order.items[itemIndex].totalPrice =
        order.items[itemIndex].unitPrice * order.items[itemIndex].quantity;
    } else {
      order.items.splice(itemIndex, 1);
    }
    order.total = order.items.reduce(
      (total, item) => total + item.totalPrice,
      0,
    );
    await orderCollection.updateOne({}, { $set: order });
    const updatedOrder = await orderCollection.findOne({});
    return {
      status: 200,
      success: true,
      message: 'Item removed successfully',
      order: updatedOrder,
    };
  }

  /**
   * Cancels an order for a given user.
   * @param user_id - The ID of the user.
   * @returns A promise that resolves to an object containing the status, success, and message of the cancellation.
   */
  async cancelOrder(
    user_id: string,
  ): Promise<{ status: number; success: boolean; message: string }> {
    const db = this.databaseService.getDb();
    const orderCollection = db.collection(`orders_user_${user_id}`);
    const order = await orderCollection.findOne({});
    if (!order) {
      return {
        status: 404,
        success: false,
        message: 'Order not found',
      };
    }
    await orderCollection.deleteOne({});
    return {
      status: 200,
      success: true,
      message: 'Order cancelled successfully',
    };
  }

  /**
   * Retrieves an order for a given user.
   * @param user_id - The ID of the user.
   * @returns A Promise that resolves to an object containing the order details.
   */
  async getOrder(user_id: string): Promise<{
    status: number;
    success: boolean;
    message: string;
    order?: any;
  }> {
    const db = this.databaseService.getDb();
    const orderCollection = db.collection(`orders_user_${user_id}`);
    const order = await orderCollection.findOne({});
    if (!order) {
      return {
        status: 404,
        success: false,
        message: 'Order not found',
      };
    }
    return {
      status: 200,
      success: true,
      message: 'Order found',
      order: order,
    };
  }

  /**
   * Creates a new instance of an item in the items list.
   *
   * @param itemData - The data of the item to be instantiated.
   * @returns The newly instantiated item.
   */
  instanciateItem(itemData: itemData): ItemsList {
    return new ItemsList(itemData.barcode, itemData.name, itemData.price, 1);
  }

  /**
   * Instantiates an order based on the provided item data.
   *
   * @param itemData - The data of the item to be included in the order.
   * @returns The instantiated Order object.
   */
  instantiateOrder(itemData: itemData): Order {
    let item = this.instanciateItem(itemData);
    let itemsList: ItemsList[] = [item];
    let total: number = item.totalPrice;

    return new Order(itemsList, total);
  }
}
