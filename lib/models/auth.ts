import { firestore } from "lib/firestore";
import { Model } from "./model";

const collection = firestore.collection("auth");

export class Auth extends Model {
  constructor(id) {
    super(id);
    this.ref = collection.doc(id);
  }

  //   Este metodo estatico genera una instancia de Auth
  static async findByEmail(email: string) {
    const cleanEmail = email.trim().toLowerCase();
    const results = await collection.where("email", "==", cleanEmail).get();
    if (results.docs.length) {
      const first = results.docs[0];
      const newAuth = new Auth(first.id);
      newAuth.data = first.data();
      return newAuth;
    } else {
      return null;
    }
  }
  static async createNewAuth(data) {
    const newAuthSnap = await collection.add(data);
    const newAuth = new Auth(newAuthSnap.id);
    newAuth.data = data;
    return newAuth;
  }
}
