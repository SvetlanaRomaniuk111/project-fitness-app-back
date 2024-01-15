const { User } = require("../models/user");
const { ctrlWrapper } = require("../helpers");

const getAllUsers = async (req, res) => {
  const users = await User.find({})
  res.json(users);
}

module.exports = {
  getAllUsers: ctrlWrapper(getAllUsers),
};