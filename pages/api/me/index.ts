import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware, handlerCORS } from "lib/middlewares";
import methods from "micro-method-router";
import { getMe, patchMe } from "controllers/users";
import * as yup from "yup";

let bodySchema = yup
  .object()
  .shape({
    email: yup.string(),
    name: yup.string(),
    address: yup.string(),
    telefono: yup.string(),
  })
  .noUnknown()
  .strict();

async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const userData = await getMe(token);

  res.send(userData);
}

async function patchHandler(req: NextApiRequest, res: NextApiResponse, token) {
  try {
    await bodySchema.validate(req.body);
    await patchMe(token, req.body);
    res.send({ message: "Usuario actualizado con éxito" });
  } catch (e) {
    res.status(400).json({ field: "body", message: e });
  }
}

const handler = methods({
  get: getHandler,
  patch: patchHandler,
});

const auth = authMiddleware(handler);

export default handlerCORS(auth);
