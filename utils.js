const User = require("./models/user.model");

module.exports = {
  getUser: async (username) => {
    return User.findOne({ username });
  },
};
