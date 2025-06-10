export default function (req, res, next) {
  res.status(404);

  if (req.accepts("html")) {
    res.render("404", { url: req.url });
    return;
  }
}
