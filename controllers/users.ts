import { User } from "models/user";

export async function getMe(token) {
  const user = new User(token.userId);
  if (user) {
    await user.pull();
    return user.data;
  } else {
    throw "No se puedo obtener el usuario";
  }
}

export async function patchMe(token, data) {
  await User.updateUser(token.userId, data);
}
