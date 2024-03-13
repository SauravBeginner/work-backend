const express = require("express");
const router = express.Router();

const userRouter = require("./user.route");
const documentRouter = require("./document.route");

router.use("/user", userRouter);
router.use("/document", documentRouter);

module.exports = router;
