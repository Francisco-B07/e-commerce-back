import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import * as yup from "yup";
import { bodySchemaMiddleware, handlerCORS } from "lib/middlewares";
import { generateToken } from "controllers/auth";

let bodySchema = yup
  .object()
  .shape({
    email: yup.string().required(),
    code: yup.number().required(),
  })
  .noUnknown()
  .strict();

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { email, code } = req.body;

  try {
    const { token } = await generateToken(email, code);
    res.send({ token });
  } catch (e) {
    res.status(400).json({ message: e });
  }
}

const handler = methods({
  post: postHandler,
});

const schemaMiddleware = bodySchemaMiddleware(bodySchema, handler);

export default handlerCORS(schemaMiddleware);
