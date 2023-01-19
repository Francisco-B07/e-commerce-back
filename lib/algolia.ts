import algoliasearch from "algoliasearch";

const client = algoliasearch(
  "WUUAVWVTVA",
  process.env.YOUR_ADMIN_API_KEY_ALGOLIA
);
export const productsIndex = client.initIndex("products");
