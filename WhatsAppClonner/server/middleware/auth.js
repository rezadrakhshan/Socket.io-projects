import jwt from "jsonwebtoken";
import c from "config";

export default function isLoggedIn(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) { 
    return res.redirect("/authentication");
  }
  try {
    const decoded = jwt.verify(token, c.get("jwt_secret"));
    next()
  } catch (err) {
    return res.status(400).send("invalid token")
  }
}
