import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware, schemaMiddleware } from "lib/middlewares";
import { createOrder } from "controllers/orders";
import * as yup from "yup";

let querySchema = yup.object().shape({
  productId: yup.string().required(),
});

let bodySchema = yup
  .object()
  .shape({
    color: yup.string(),
    address: yup.string(),
  })
  .noUnknown()
  .strict();

async function postHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const { productId } = req.query as any;

  try {
    const { url } = await createOrder(token.userId, productId, req.body);
    res.send({ url });
  } catch (e) {
    res.status(400).json({ message: e });
  }
}

const handler = methods({
  post: postHandler,
});

const auth = authMiddleware(handler);

export default schemaMiddleware(querySchema, bodySchema, auth);
