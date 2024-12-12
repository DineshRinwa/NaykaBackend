const mongoose = require("mongoose");
const MONGO_URL = process.env.MONGO_URL;

// Connect Funcation for Database
const connect = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB is Connected...");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connect;