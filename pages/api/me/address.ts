import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import * as yup from "yup";
import { patchMe } from "controllers/users";
import {
  authMiddleware,
  bodySchemaMiddleware,
  handlerCORS,
} from "lib/middlewares";

let bodySchema = yup
  .object()
  .shape({
    address: yup.string(),
  })
  .noUnknown()
  .strict();

async function patchHandler(req: NextApiRequest, res: NextApiResponse, token) {
  await patchMe(token, req.body);
  res.send({ message: "Dirección actualizada con éxito" });
}

const handler = methods({
  patch: patchHandler,
});

const auth = authMiddleware(handler);

const schemaMiddleware = bodySchemaMiddleware(bodySchema, auth);

export default handlerCORS(schemaMiddleware);
