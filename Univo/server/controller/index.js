export default new (class {
  async home(req, res) {
    res.render("index");
  }
  async about(req, res) {
    res.render("about");
  }
})();
