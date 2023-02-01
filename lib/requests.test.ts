import test from "ava";
import { getOffsetAndLimitFromReq } from "./requests";

const req: any = {
  query: {
    limit: 5,
    offset: 1,
  },
};

test("requests", (t) => {
  const limit = 5;
  const offset = 1;

  const result = getOffsetAndLimitFromReq(req);
  const test = { limit, offset };

  t.deepEqual(test, result);
});
