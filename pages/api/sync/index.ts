import { NextApiRequest, NextApiResponse } from "next";
import { getOffsetAndLimitFromReq } from "lib/requests";
import { airtableBase } from "lib/airtable";
import { productsIndex } from "lib/algolia";

export default function (req: NextApiRequest, res: NextApiResponse) {
  //   const { offset, limit } = getOffsetAndLimitFromReq(req, 100, 10000);

  airtableBase("Furniture")
    .select({
      pageSize: 10,
    })
    .eachPage(
      async function (records, fetchNextPage) {
        const objects = records.map((r) => {
          return {
            objectID: r.id,
            ...r.fields,
          };
        });
        await productsIndex.saveObjects(objects);
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
}
