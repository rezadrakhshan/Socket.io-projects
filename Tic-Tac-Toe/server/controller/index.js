import { __dirname } from "../server.js";
import path from "path";

export default new (class {
  async homePage(req, res) {
    res.sendFile(path.join(__dirname, "client/public/templates/index.html"));
  }
})();
