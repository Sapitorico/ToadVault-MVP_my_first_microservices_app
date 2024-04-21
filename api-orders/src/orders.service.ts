import { Injectable } from '@nestjs/common';
import { DatabaseService } from './databases/db_connection';
import { ItemsList, Order, itemData } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createOrder(
    user_id: string,
    itemData: itemData,
  ): Promise<{
    status: number;
    success: boolean;
    message: string;
    order: any;
  }> {
    console.log(itemData);
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
        status: 200,
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
      // Si el producto está en la orden, incrementa la cantidad
      existingOrder.items[itemIndex].quantity += 1;
      existingOrder.items[itemIndex].totalPrice =
        existingOrder.items[itemIndex].unitPrice *
        existingOrder.items[itemIndex].quantity;
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

  instanciateItem(itemData: itemData): ItemsList {
    return new ItemsList(itemData.barcode, itemData.name, itemData.price, 1);
  }

  instantiateOrder(itemData: itemData): Order {
    let item = this.instanciateItem(itemData);
    let itemsList: ItemsList[] = [item];
    let total: number = item.totalPrice;

    return new Order(itemsList, total);
  }
}
