import type { NextApiRequest, NextApiResponse } from "next";

import { User } from "lib/models/user";
import { authMiddleware } from "lib/middlewares";
// import methods from "micro-method-router";

// export default methods({
//   async get(req: NextApiRequest, res: NextApiResponse) {
//     res.status(200).send("ok");
//   },
//   async patch(req: NextApiRequest, res: NextApiResponse) {
//     res.status(200).send("ok");
//   },
// });

async function handler(req: NextApiRequest, res: NextApiResponse, token) {
  const user = new User(token.userId);
  await user.pull();
  res.send(user.data);
}

export default authMiddleware(handler);
