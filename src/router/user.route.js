const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../model/user.model");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middleware/verifyToken");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email && !password) {
      console.log("Enter Email and Password to Proceed!");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists!" });
    }
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    //     return res.json({ message: "User updated successfully!", email });

    const user = await User.create({
      email,
      //  username,
      password: hashedPassword,
    });
    console.log({ user });
    return res.json({ message: "User signed up successfully!", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email && !password) {
      console.log("Enter Email and Password to Proceed!");
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ error: "User doesn't exists!" });
    }
    const salt = await bcrypt.genSalt(10);

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid Credentials!" });
    }

    const { id, email: emailId, username } = existingUser;

    const token = jwt.sign(
      { userId: id, emailId: emailId, username },
      process.env.SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    console.log({ existingUser, token });
    return res.json({
      message: "User logged in successfully!",
      existingUser,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/setUserName", verifyToken, async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Please provide a username!" });
  }
  const userId = req.user._id; // Get user ID from decoded token

  console.log(req.user);
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: "User not found!" });
  }

  // Update the username
  user.username = username;
  user.isFirst = false; // Set isFirst to false after setting the username
  await user.save();

  return res.json({ message: "Username saved successfully!", user });
});

router.get("/getUserData", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    console.log(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user data including username
    res.json({ user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
