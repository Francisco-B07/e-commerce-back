import { NextApiRequest, NextApiResponse } from "next";
import { generate } from "lib/jwt";
import addMinutes from "date-fns/addMinutes";
import { Auth } from "lib/models/auth";
import isAfter from "date-fns/isAfter";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const email = req.body.email;
  const code = req.body.code;
  const auth = await Auth.findByEmailAndCode(email, code);

  if (!auth) {
    res.status(401).send({ message: "email o code incorrect" });
  }

  const validCode = auth.isValidCode();
  if (validCode) {
    const token = generate({ userId: auth.data.userId });
    res.send({ token });
  } else {
    res.status(401).send("El código ingresado expiró");
  }
}
