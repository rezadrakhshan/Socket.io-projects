export default function (req, res, next) {
  if (req.session.userID) {
    return next();
  }
  if (req.path.startsWith('/auth')) {
    return next();
  }
  return res.redirect("/auth");
}
