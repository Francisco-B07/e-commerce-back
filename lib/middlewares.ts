import { NextApiRequest, NextApiResponse } from "next";
import parseToken from "parse-bearer-token";
import { decode } from "lib/jwt";
import NextCors from "nextjs-cors";

// ------FUNCIONES PARA VALIDAR BODY Y QUERY------
async function bodyValidate(
  req: NextApiRequest,
  res: NextApiResponse,
  bodySchema
) {
  try {
    await bodySchema.validate(req.body);
  } catch (e) {
    res.status(400).json({ field: "body", message: e });
  }
}

async function queryValidate(
  req: NextApiRequest,
  res: NextApiResponse,
  querySchema
) {
  try {
    await querySchema.validate(req.query);
  } catch (e) {
    res.status(400).json({ field: "query", message: e });
  }
}
// ----------------------------------------------------------

export function authMiddleware(callback) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    const token = parseToken(req);
    if (!token) {
      res.status(401).send({ message: "no hay Token" });
    }
    const decodedToken = decode(token);
    if (decodedToken) {
      callback(req, res, decodedToken);
    } else {
      res.status(401).send({ message: "Token incorrecto" });
    }
  };
}

export function schemaMiddleware(querySchema, bodySchema, callback) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    await queryValidate(req, res, querySchema);
    await bodyValidate(req, res, bodySchema);
    callback(req, res);
  };
}

export function bodySchemaMiddleware(bodySchema, callback) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    await bodyValidate(req, res, bodySchema);
    callback(req, res);
  };
}
export function querySchemaMiddleware(querySchema, callback) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    await queryValidate(req, res, querySchema);
    callback(req, res);
  };
}

// ----------------CORS-------------------
export function handlerCORS(callback) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    // Run the cors middleware
    // nextjs-cors uses the cors package, so we invite you to check the documentation https://github.com/expressjs/cors
    await NextCors(req, res, {
      // Options
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      origin: "*",
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });

    // Rest of the API logic
    callback(req, res);
    //res.json({ message: "Hello NextJs Cors!" });
  };
}
