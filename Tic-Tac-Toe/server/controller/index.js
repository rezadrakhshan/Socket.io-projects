import { __dirname } from "../server.js";
import path from "path";

export default new (class {
  async homePage(req, res) {
    res.render("index", { user: req.user });
  }
})();
