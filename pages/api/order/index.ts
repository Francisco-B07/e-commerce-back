import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware, handlerCORS, schemaMiddleware } from "lib/middlewares";
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
    const { url, orderId } = await createOrder(
      token.userId,
      productId,
      req.body
    );
    res.send({ url, orderId });
  } catch (e) {
    res.status(400).json({ message: e });
  }
}

const handler = methods({
  post: postHandler,
});

const auth = authMiddleware(handler);

const schema = schemaMiddleware(querySchema, bodySchema, auth);

export default handlerCORS(schema);
