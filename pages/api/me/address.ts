import methods from "micro-method-router";

module.exports = methods({
  async patch(req, res) {
    return handler(req, res);
  },
});

function handler(req, res) {
  res.status(200).send("Status: OK");
}
