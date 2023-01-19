import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { sendCode } from "lib/controllers/auth";

export default methods({
  async post(req: NextApiRequest, res: NextApiResponse) {
    const data = await post(req, res);
    res.status(200).send(data);
  },
});

async function post(req, res) {
  const auth = await sendCode(req.body.email);

  res.send(auth.data);
}
