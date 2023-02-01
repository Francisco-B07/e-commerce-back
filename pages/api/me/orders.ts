import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares";
import { getOrders } from "controllers/orders";

async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
  try {
    const orders = await getOrders(token);
    res.status(200).send({ orders });
  } catch (e) {
    res.status(404).send(e);
  }
}

const handler = methods({
  get: getHandler,
});

export default authMiddleware(handler);
