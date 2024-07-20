const express = require("express");
const User = require("../model/user");
const { sendResponse } = require("../helper");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

authRouter.get("/", (req, res, next) => {
  return sendResponse(res, {
    message: "Welcome to Job Tracker API",
  });
});

authRouter.post("/register", async (req, res, next) => {
  try {
    const { email, password } = User(req.body);

    if (!email || !password) {
      return sendResponse(res, "provide email and password", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: hashedPassword });

    if (!user) {
      return sendResponse(res, "User already exists", 400);
    }

    const token = jwt.sign(
      { email: user.email, user_id: user._id },
      process.env.JWT_SECRET
    );

    return sendResponse(res, { token });
  } catch (error) {
    return sendResponse(res, error.message, 500);
  }
});

authRouter.post("/login", async (req, res, next) => {
  const { email, password } = User(req.body);

  if (!email || !password) {
    return sendResponse(res, "provide email and password", 400);
  }

  const user = await User.findOne({ email });

  if (!user) {
    return sendResponse(res, "User not found", 404);
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return sendResponse(res, "Password does not match", 400);
  }

  const token = jwt.sign(
    { email: user.email, user_id: user._id },
    process.env.JWT_SECRET
  );

  return sendResponse(res, { token });
});

authRouter.post("/verifyjwt", async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return sendResponse(res, "provide token", 400);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    return sendResponse(res, decoded);
  } catch (error) {
    return sendResponse(res, { message: "Invalid token" }, 401);
  }
});

module.exports = authRouter;
