import isAfter from "date-fns/isAfter";
import { firestore } from "lib/firestore";
import { Model } from "./model";

const collection = firestore.collection("auth");

export class Auth extends Model {
  constructor(id) {
    super(id);
    this.ref = collection.doc(id);
  }

  isValidCode() {
    const now = new Date();
    const expires = this.data.expires.toDate();

    // Pregunto si la fecha en la que expira el código es después de la fecha actual
    const validCode = isAfter(expires, now);

    return validCode;
  }

  //   Este metodo estatico genera una instancia de Auth
  static async findByEmail(email: string) {
    const cleanEmail = this.cleanEmail(email);
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
  static cleanEmail(email: string) {
    return email.trim().toLowerCase();
  }
  static async findByEmailAndCode(email: string, code: number) {
    const cleanEmail = this.cleanEmail(email);
    const result = await collection
      .where("email", "==", cleanEmail)
      .where("code", "==", code)
      .get();
    if (result.empty) {
      return null;
    } else {
      const doc = result.docs[0];
      const auth = new Auth(doc.id);
      auth.data = doc.data();
      return auth;
    }
  }
}
