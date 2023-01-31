import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { sendCode } from "controllers/auth";
import * as yup from "yup";
import { bodySchemaMiddleware } from "lib/middlewares";

let bodySchema = yup
  .object()
  .shape({
    email: yup.string().required(),
  })
  .noUnknown()
  .strict();

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const results = await sendCode(req.body.email);
  res.status(200).send({ results });
}

const handler = methods({
  post: postHandler,
});

export default bodySchemaMiddleware(bodySchema, handler);
