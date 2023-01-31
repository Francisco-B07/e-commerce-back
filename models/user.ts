import { firestore } from "lib/firestore";
import { Model } from "./model";

const collection = firestore.collection("users");

export class User extends Model {
  constructor(id) {
    super(id);
    this.ref = collection.doc(id);
  }

  static async createNewUser(data) {
    const newUserSnap = await collection.add(data);
    const newUser = new User(newUserSnap.id);
    newUser.data = data;
    return newUser;
  }
  static async updateUser(userId, data) {
    const documentRef = collection.doc(userId);

    await documentRef.update(data);
  }
}
