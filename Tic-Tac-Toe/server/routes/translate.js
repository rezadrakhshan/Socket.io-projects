import { Router } from "express";
import path from "path"
import { __dirname } from "../server.js";

const router = Router()

router.get('/:lng/translation.json', (req, res) => {
  const filePath = path.join(__dirname, `locales/${req.params.lng}/translation.json`);
  res.sendFile(filePath);
});

export default router