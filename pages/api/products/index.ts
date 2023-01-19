import { NextApiRequest, NextApiResponse } from "next";
import { productsIndex } from "lib/algolia";
import { getOffsetAndLimitFromReq } from "lib/requests";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { offset, limit } = getOffsetAndLimitFromReq(req);

  const results = await productsIndex.search(req.query.q as string, {
    offset: offset,
    length: limit,
  });

  const responseAPI = {
    results: results.hits,
    pagination: { offset, limit, total: results.nbHits },
  };
  res.send(responseAPI);
}
