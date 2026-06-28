const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: Object.values(error.errors)[0].message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid email or password" });

    res.status(200).json({
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login };