import methods from "micro-method-router";

module.exports = methods({
  async post(req, res) {
    return handler(req, res);
  },
});

function handler(req, res) {
  res.status(200).send("Status: OK");
}
