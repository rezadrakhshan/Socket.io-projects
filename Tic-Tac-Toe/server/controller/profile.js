export default new (class {
  async updateAvatar(req, res) {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const profilePath = "/public/image/users/" + req.file.filename;
    res.json({ success: true, profilePath });
  }
})();
