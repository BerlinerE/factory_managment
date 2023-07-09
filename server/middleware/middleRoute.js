const express = require("express");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const url = "https://jsonplaceholder.typicode.com/users";
const { logAction } = require("../DAL/UsersActionFile");
const usersBLL = require('../BLL/usersBLL');
const User = require('../models/userModel');

const JWT_SECRET = "this-is-my-secret-key-in-nodejs";

const router = express.Router();

const login = async (req, res, next) => {
  const { username, email } = req.body;
  try {
    const response = await axios.get(url);
    const data = response.data;

    // Checking if user exists in the web service data
    const user = data.find((el) => el.username === username && el.email === email);

    if (user) {
      req.session.userId = user.id;
       // Create a new token
      const token = jwt.sign({ id: user.id , fullName: user.name }, JWT_SECRET, { expiresIn: "90d" }); 
      console.log("login.token:",token)
      res.status(200).json({
         status: "Success",
         data: {
           name: user.name,
           id: user.id,
           token,
         },
       });
   
     } else {
       res.status(404).json({
         status: "Failed to verify user",
       });
     }
   
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({
      status: "Failed to fetch user data",
    });
  }
};

const authenticateToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(401).json("No token provided!");
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json("Failed to authenticate token");
    }
    req.user = decoded;
    req.userId = decoded.id;
    next();
  });
};

const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

const logUserAction = async (userId, action) => {
  try {
    const user = await usersBLL.getUserById(userId);
    console.log("action:", action);
    const actionData = {
      userName: user.fullName,
      actionTime: new Date(),
      numOfActions: user.numOfActions,
      actionCount: user.actionCount,
      action: action,
    };

    const filePath = './DATA/UsersActions.json';
    await logAction(actionData, filePath);

    console.log("Action logged successfully!");
  } catch (err) {
    console.error("Error logging action:", err);
  }
};

const checkUserActions = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findOne({ webId: userId });

    if (!user) {
      console.log(`User not found with userId: ${userId}`);
      return;
    }

    if (user.actionCount >= user.numOfActions) {
      console.log("maximum");
      return res.redirect('http://localhost:8000/users/login');
    }

    user.actionCount += 1;
    await user.save();

    next();
  } catch (error) {
    console.log('Error checking user actions:', error);
    res.status(500).json({ error: 'Error checking user actions' });
  }
};

router.post('/', login);

module.exports = {
  router,
  authenticateToken,
  isAuthenticated,
  logUserAction,
  checkUserActions
};
