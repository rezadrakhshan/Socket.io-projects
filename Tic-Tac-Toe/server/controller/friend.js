import User from "../models/user.js";

export default new (class {
  async removeFriend(user, friend) {
    const userObject = await User.updateOne(
      { _id: user },
      { $pull: { friends: friend } }
    );
    const friendObject = await User.updateOne(
      { _id: friend },
      { $pull: { friends: user } }
    );
    return "Friend Was Remove"
  }
})();
