const jwt = require("jsonwebtoken");
const JWT_SCRECT_KEY = process.env.JWT_SCRECT_KEY;

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SCRECT_KEY);
    req.user = decoded;
    next(); // Proceed to the next middleware
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
};
module.exports = auth;
