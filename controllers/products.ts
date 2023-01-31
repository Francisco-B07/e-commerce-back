import { productsIndex } from "lib/algolia";

export async function searchProductByQuery(offset, limit, q) {
  const results = await productsIndex.search(q as string, {
    offset: offset,
    length: limit,
  });

  const hits: any = results.hits;
  let resultsInStock: any = [];

  for (let index = 0; index < hits.length; index++) {
    if (hits[index].inStock) {
      resultsInStock.push(hits[index]);
    }
  }

  const responseAPI = {
    results: resultsInStock,
    pagination: {
      offset,
      limit,
      total: results.nbHits,
      totalInStock: resultsInStock.length,
    },
  };
  return responseAPI;
}
