import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware, querySchemaMiddleware } from "lib/middlewares";
import methods from "micro-method-router";
import { completeOperation } from "controllers/orders";
import * as yup from "yup";

let querySchema = yup
  .object()
  .shape({
    id: yup.string(),
    topic: yup.string(),
  })
  .noUnknown()
  .strict();

async function postHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const { id, topic } = req.query;

  await completeOperation(topic, id, token);

  res.send({ message: "Finalizó la operación" });
}

const handler = methods({
  post: postHandler,
});

const auth = authMiddleware(handler);

export default querySchemaMiddleware(querySchema, auth);
