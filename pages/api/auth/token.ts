import { NextApiRequest, NextApiResponse } from "next";
import { generate } from "lib/jwt";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const token = generate({ userId: "MklpdRW9ucoBNg4sf9Ui" });
  res.send({ token });
}
