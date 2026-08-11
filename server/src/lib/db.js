const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async function(url) {
  return mongoose.connect(url, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
  });
};

module.exports = connectDB;
