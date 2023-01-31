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
}
