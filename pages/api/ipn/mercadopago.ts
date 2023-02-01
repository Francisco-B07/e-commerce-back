import { NextApiRequest, NextApiResponse } from "next";
import { completeOperation } from "controllers/orders";

export default async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, topic } = req.query;

  await completeOperation(topic, id);

  res.send({ message: "Finalizó la operación" });
}
