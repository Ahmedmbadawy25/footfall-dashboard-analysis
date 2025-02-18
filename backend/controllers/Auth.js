const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();


// @desc    Register a new user and log them in
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;

  if (!email || !password || !firstName || !lastName || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    role,
  });

  if (!newUser) {
    return res.status(500).json({ message: 'User creation failed' });
  }


  res.status(201).json({
    id: newUser._id,
    email: newUser.email,
    message: "User registered successfully"
  });
});

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie("token", token, {
    httpOnly: true, // Prevents access from JavaScript
    sameSite: "None", // Prevent CSRF attacks
    maxAge: 60 * 60 * 1000, // Cookie expires in 1hr
    secure: true
  });

  res.status(200).json({ user:{id: user._id, role:user.role}, message:"User logged in successfully" });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User logged out successfully" });
});

const returnUserDetails = asyncHandler(async (req, res) => {
  try {
    // Extract token from cookies
    if (!req.headers.cookie) {
      return res.status(401).json({ message: 'Unauthorized - No cookies found' });
  }
    const cookies = req.headers.cookie.split('; ').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key] = value;
      return acc;
    }, {});

    const token = cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    // Verify and decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('firstName')
    
    // Return user data (you might want to fetch extra details from DB)
    return res.status(200).json({ user: decoded, name:user.firstName});
  } catch (error) {
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  returnUserDetails
};
