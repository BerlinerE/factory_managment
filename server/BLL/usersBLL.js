
const User = require('../models/userModel');

// GET - Get All - Read
const getAllUsers = async () => { 
  const usersDB =  User.find({});
  return await usersDB;
};

// GET - Get By ID - Read
const getUserById = (id) => {
  return User.findById({ _id: id });
};

//POST
const addUser = async (obj) => {
  const user = new User(obj);
  await user.save();
  return 'Created!';
};

module.exports = { getAllUsers, getUserById, addUser };








