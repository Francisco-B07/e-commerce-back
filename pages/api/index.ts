import { sendCode } from "lib/controllers/auth";

import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const auth = await sendCode(req.body.email);

  res.send(auth.data);
}
