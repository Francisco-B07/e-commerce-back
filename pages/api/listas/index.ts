import { NextApiRequest, NextApiResponse } from "next";

function getLista() {
  const arr = Array.from(Array(10000).keys());
  return arr.map((valor) => {
    return {
      nombre: valor,
    };
  });
}

function getOffsetAndLimitFromReq(req: NextApiRequest, maxLimit, maxOffset) {
  const queryLimit = parseInt(req.query.limit as string);
  const queryOffset = parseInt(req.query.offset as string);

  const limit = queryLimit <= maxLimit ? queryLimit : maxLimit;
  const offset = queryOffset < maxOffset ? queryOffset : 0;

  return {
    limit,
    offset,
  };
}

export default function (req: NextApiRequest, res: NextApiResponse) {
  const lista = getLista();

  const { offset, limit } = getOffsetAndLimitFromReq(req, 100, lista.length);

  const sliced = lista.slice(offset, offset + limit);

  //   res.send({ offset, limit });
  res.send({
    results: sliced,
    pagination: {
      offset,
      limit,
      total: lista.length,
    },
  });
}
