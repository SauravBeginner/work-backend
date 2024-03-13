const express = require("express");
const router = express.Router();

const Document = require("../model/document.model");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middleware/verifyToken");

// Route for creating documents
router.post("/create", verifyToken, async (req, res) => {
  try {
    // Extract document name from request body
    const { name } = req.body;

    // Create a new document instance
    const document = new Document({
      name,
      userId: req.user._id, // Assuming user ID is stored in req.user after authentication
    });

    // Save the document to the database
    await document.save();

    res.status(201).json(document);
  } catch (error) {
    console.error("Error creating document:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/mydocuments", verifyToken, async (req, res) => {
  try {
    // Retrieve documents associated with the authenticated user
    const documents = await Document.find({ userId: req.user._id });

    res.status(200).json(documents);
  } catch (error) {
    console.error("Error retrieving documents:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
