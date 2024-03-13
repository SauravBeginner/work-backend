const express = require("express");
const mongoose = require("mongoose");
// import bodyParser from "body-parser";
const jwt = require("jsonwebtoken");
const User = require("./model/user.model");
const bcrypt = require("bcrypt");

const cors = require("cors");

const dotenv = require("dotenv");

const rootRouter = require("./router/root.router");

const app = express();
const PORT = 5000;

dotenv.config("./env");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Specify the origin of your React application
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // enable credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
// MongoDB connection

const MONGO_URI = "mongodb+srv://saurav:saurav123@cluster0.aofdk.mongodb.net";
// const dbName = "freelance";
const connectDB = async () => {
  try {
    const dbName = "freelance";
    const uri = `${MONGO_URI}/${dbName}`;
    const db = await mongoose.connect(uri, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("MongoDB Connected", db.connection.host);
  } catch (err) {
    console.log("MongoDB connection Error: ", err);
    process.exit(1);
  }
};

connectDB();

app.get("/", (req, res) => {
  return res.json("Hello Server!");
});
// Google Signin route
// app.post("/google-signin", async (req: Request, res: Response) => {
//   const { googleId } = req.body;

//   try {
//     // Check if the user exists
//     const user = await User.findOne({ googleId });
//     console.log("user", user);

//     if (!user) {
//       // If the user doesn't exist, create a new user
//       return res.status(200).json({ isNewUser: true });
//     }

//     // If the user already exists, create a JWT token and send it back
//     const token = jwt.sign({ googleId }, "your-secret-key");
//     res.status(200).json({ isNewUser: false, token });
//   } catch (err) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Save username route
// app.post("/save-username", async (req: Request, res: Response) => {
//   const { googleId, username } = req.body;

//   try {
//     // Update the user with the provided username
//     const user = await User.findOneAndUpdate(
//       { googleId },
//       { username },
//       { new: true }
//     );

//     // Create a JWT token and send it back
//     const token = jwt.sign({ googleId, username }, "your-secret-key");
//     res.status(200).json({ token });
//   } catch (err) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

app.use("/api", rootRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
