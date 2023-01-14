import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";

export default methods({
  async order(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).send("ok");
  },
});
