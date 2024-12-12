const mongoose = require("mongoose");

// Cart Schema
const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      productId: { type: String, required: true },
      quantity: { type: String, required: true },
    },
  ],
  createAt: { type: Date, default: Date.now },
});

const Cart = mongoose.model("Cart", cartSchema); // Cart Model
module.exports = Cart;