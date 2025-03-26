import parentController from "../../controller.js"
import { __dirname } from "../../../server.js";
import path from "path";

export default new (class extends parentController {
    async homePage(req,res){
        res.sendFile(path.join(__dirname, "client/public/templates/index.html"));
    }
})();
