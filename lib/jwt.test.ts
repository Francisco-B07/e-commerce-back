import { generate, decode } from "./jwt";
import test from "ava";

test("jwt encode/decode", (t) => {
  const payload = { test: true };
  const token = generate(payload);
  const salida = decode(token) as any;
  delete salida.iat;

  t.deepEqual(payload, salida);
});
