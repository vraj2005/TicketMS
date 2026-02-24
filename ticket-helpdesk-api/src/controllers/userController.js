const User = require("../models/User");

exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({ name, email, password, role });
  res.status(201).json(user);
};

exports.getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};
