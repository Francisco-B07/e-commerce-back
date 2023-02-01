import { NextApiRequest, NextApiResponse } from "next";
import { getOffsetAndLimitFromReq } from "lib/requests";
import { searchProductsByQuery } from "controllers/products";
import methods from "micro-method-router";
import * as yup from "yup";
import { querySchemaMiddleware } from "lib/middlewares";

let querySchema = yup
  .object()
  .shape({
    limit: yup.string(),
    offset: yup.string(),
    q: yup.string(),
  })
  .noUnknown()
  .strict();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const { offset, limit } = getOffsetAndLimitFromReq(req);
  const { q } = req.query;
  const responseAPI = await searchProductsByQuery(offset, limit, q);

  res.send(responseAPI);
}

const handler = methods({
  get: getHandler,
});

export default querySchemaMiddleware(querySchema, handler);
