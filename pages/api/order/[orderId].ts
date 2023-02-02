import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware, handlerCORS } from "lib/middlewares";
import { getOrderById } from "controllers/orders";

async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const { orderId } = req.query;

  try {
    const orders = await getOrderById(orderId);
    res.status(200).send(orders);
  } catch (e) {
    res.status(404).send(e);
  }
}

const handler = methods({
  get: getHandler,
});

const auth = authMiddleware(handler);

export default handlerCORS(auth);
