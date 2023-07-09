const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/Factory")
    .then(() => console.log("Connected to FactoryDB!"))
    .catch((error) => console.log(error));
};

module.exports = connectDB;
