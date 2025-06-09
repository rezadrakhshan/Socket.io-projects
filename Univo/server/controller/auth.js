import _ from "lodash";

export default new (class {
  async auth(req, res) {
    res.render("auth");
  }
})();
