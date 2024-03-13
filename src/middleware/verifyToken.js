const jwt = require("jsonwebtoken");

const User = require("../model/user.model");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(decoded.userId);

    console.log(decoded);
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid token." });
  }
};

module.exports = {
  verifyToken,
};
