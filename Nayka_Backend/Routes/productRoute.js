const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../Middleware/auth");

// Handle Error Function
const handleError = (res, error, status = 400) => {
  return res.status(status).json({ error: error.message || error });
};

// Product Route
router.get("/products", auth, async (req, res) => {
  try {
    const {
      price_range_filter,
      category,
      country_of_origin_filter,
      star_rating_filter,
      page_no = 1,
      limit = 10,
      sort = "price_desc",
      search,
    } = req.query;

    let query = {};

    // Price range filter
    if (price_range_filter) {
      const [minPrice, maxPrice] = price_range_filter.split("-").map(Number);
      query.price = { $gte: minPrice, $lte: maxPrice };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Country of origin filter (nested field)
    if (country_of_origin_filter) {
      query["description.country_of_origin"] = country_of_origin_filter;
    }

    // Star rating filter
    if (star_rating_filter) {
      query.rating = { $gte: Number(star_rating_filter) };
    }

    // Search filter (case-insensitive search by name)
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Sort Price
    let sortCriteria = {};
    if (sort === "price_desc") {
      sortCriteria.price = -1;
    } else if (sort === "price_asc") {
      sortCriteria.price = 1;
    }

    // Pagination: Calculate skip based on page number and limit
    const skip = (parseInt(page_no) - 1) * parseInt(limit);

    // Access the product collection directly
    const productCollection = mongoose.connection.collection("products");

    // Fetch filtered products
    const products = await productCollection
      .find(query) // Apply filters dynamically
      .sort(sortCriteria) // Apply sorting
      .skip(skip) // Apply pagination (skip records)
      .limit(parseInt(limit)) // Limit results per page
      .toArray(); // Convert to array

    // Count the total number of products matching the query
    const totalProducts = await productCollection.countDocuments(query);

    // If no products are found, return a message
    if (products.length === 0) {
      return res.status(200).json({
        message: "No products found.",
        products: [],
        totalProducts: 0,
        totalPages: 0,
        currentPage: parseInt(page_no),
      });
    }

    // Return the products and pagination details
    return res.status(200).json({
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: parseInt(page_no),
    });
  } catch (error) {
    handleError(res, error);
  }
});

// Get One Product
router.post("/product", auth, async (req, res) => {
  try {
    const { productId } = req.body;

    // Check if productId is provided
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Convert productId to ObjectId format
    const productObjectId = new mongoose.Types.ObjectId(productId);

    // Access the product collection directly
    const productCollection = mongoose.connection.collection("products");

    // Fetch the product by _id (use ObjectId format for _id)
    const product = await productCollection
      .find({ _id: productObjectId })
      .toArray();
    // check product found or not
    if (product.length === 0) {
      return res.status(200).json({ message: "No products found." });
    }

    return res.status(200).json({ message: "Product Found", product });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;