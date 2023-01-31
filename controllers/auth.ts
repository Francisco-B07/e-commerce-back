import { Auth } from "models/auth";
import { User } from "models/user";
import gen from "random-seed";
import addMinutes from "date-fns/addMinutes";
import * as sgMail from "@sendgrid/mail";
import { generate } from "lib/jwt";

sgMail.setApiKey(process.env.SENDGRID_KEY);

var random = gen.create();

export async function findOrCreateAuth(email: string): Promise<Auth> {
  const cleanEmail = email.trim().toLowerCase();
  const auth = await Auth.findByEmail(cleanEmail);

  if (auth) {
    return auth;
  } else {
    const newUser = await User.createNewUser({
      email: cleanEmail,
    });
    const newAuth = await Auth.createNewAuth({
      email: cleanEmail,
      userId: newUser.id,
      code: "",
      expires: new Date(),
    });
    return newAuth;
  }
}

async function sendEmail(email: string, code: number) {
  const msg = {
    to: email as string,
    from: "franciscojburgoa@gmail.com",
    subject: "Código e-commerce",
    text: "Código",
    html: `
      <p>Tu código es: <strong>${code}</strong></p>
      `,
  };

  try {
    await sgMail.send(msg);
  } catch (err) {
    console.log(err.code, err.message);
  }
}

export async function sendCode(email: string) {
  const auth = await findOrCreateAuth(email);
  const code = random.intBetween(100000, 999999);

  const now = new Date();
  const twentyMinutesFromNow = addMinutes(now, 20);

  auth.data.code = code;
  auth.data.expires = twentyMinutesFromNow;
  auth.data.codeUsed = false;

  await auth.push();
  await sendEmail(email, code);

  return true;
}

export async function generateToken(email, code) {
  const auth = await Auth.findByEmailAndCode(email, code);

  if (!auth) {
    throw "email o code incorrect";
  }

  const validCode = auth.isValidCode();
  if (validCode) {
    const token = generate({ userId: auth.data.userId });

    auth.data.codeUsed = true;
    await auth.push();

    return { token };
  } else {
    throw "El código ingresado expiró";
  }
}
