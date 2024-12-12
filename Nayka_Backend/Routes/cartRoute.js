const express = require("express");
const router = express.Router();
const Cart = require("../Model/cartModel");
const auth = require("../Middleware/auth");

// Handle Error
const handleError = (res, error, status = 400) => {
  return res.status(status).json({ error: error.message || error });
};

// Add Cart
router.post("/add_cart", auth, async (req, res) => {
  const userId = req.user.userId;
  try {
    let { productId } = req.body; // `productId` destructured from the request body

    // Find user's cart
    let cart = await Cart.findOne({ userId }); // Changed `const` to `let`

    // If no cart exists for the user, create a new one
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity: 1 }],
      });
    } else {
      // Check if the product is already in the cart
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId.toString()
      );

      if (existingItem) {
        existingItem.quantity += 1; // If the product exists, increment the quantity
      } else {
        cart.items.push({ productId, quantity: 1 }); // If the product does not exist, add it to the items array
      }
    }

    await cart.save();
    return res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;
