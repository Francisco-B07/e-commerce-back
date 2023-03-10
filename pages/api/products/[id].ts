import { NextApiRequest, NextApiResponse } from "next";
import { searchProductById } from "controllers/products";
import methods from "micro-method-router";
import * as yup from "yup";
import { handlerCORS, querySchemaMiddleware } from "lib/middlewares";

let querySchema = yup
  .object()
  .shape({
    id: yup.string(),
  })
  .noUnknown()
  .strict();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const product = await searchProductById(id);
    res.send({ product });
  } catch (e) {
    res.status(404).send(e);
  }
}

const handler = methods({
  get: getHandler,
});

const querySchemaMidd = querySchemaMiddleware(querySchema, handler);

export default handlerCORS(querySchemaMidd);
