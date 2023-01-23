import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { sendCode } from "lib/controllers/auth";

export default methods({
  async post(req: NextApiRequest, res: NextApiResponse) {
    const results = await post(req, res);
    res.status(200).send({ results });
  },
});

async function post(req, res) {
  const results = await sendCode(req.body.email);

  return results;
}
