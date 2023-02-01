import { firestore } from "lib/firestore";
import { Model } from "./model";

const collection = firestore.collection("orders");

export class Order extends Model {
  constructor(id) {
    super(id);
    this.ref = collection.doc(id);
  }

  static async createNewOrder(newOrderData = {}) {
    const newOrderSnap = await collection.add(newOrderData);
    const newOrder = new Order(newOrderSnap.id);
    newOrder.data = newOrderData;
    newOrder.data.createdAt = new Date();
    return newOrder;
  }
  static async findOfUser(userId: string) {
    const results = await collection.where("userId", "==", userId).get();
    const orders = [];
    if (results.docs.length) {
      for (let index = 0; index < results.docs.length; index++) {
        orders.push(results.docs[index].data());
      }

      return orders;
    } else {
      return null;
    }
  }
  static async findById(orderId: string) {
    const order = await collection.doc(orderId).get();
    if (order) {
      return order;
    } else {
      return null;
    }
  }
}
