import methods from "micro-method-router";

module.exports = methods({
  async get(req, res) {
    return getF(req, res);
  },
  async patch(req, res) {
    return patchF(req, res);
  },
});

function getF(req, res) {
  res.status(200).send("Status: OK");
}
function patchF(req, res) {
  res.status(200).send("Status: OK");
}
