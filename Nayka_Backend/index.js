const express = require("express");
require("dotenv").config();

const connect = require("./Config/db");
const user = require('./Routes/userRoute');
const cart = require('./Routes/cartRoute');
const product = require('./Routes/productRoute');
const PORT = process.env.Port;

const app = express();
app.use(express.json()); // Parse Data
app.use('/api/auth', user);
app.use('/api/product', cart);
app.use('/api', product);

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome To Nayka");
});

// Server listen Here
app.listen(PORT, async () => {
  await connect();
  console.log(`Server is Started...`);
});