const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               name: John Doe
 *               email: john@example.com
 *               password: mysecretpassword
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             example:
 *               message: User registered successfully
 *               success: true
 *       400:
 *         description: User with this email already exists
 *         content:
 *           application/json:
 *             example:
 *               message: User with this email already exists
 *               success: false
 *       500:
 *         description: Error registering user
 *         content:
 *           application/json:
 *             example:
 *               message: Error registering user
 *               success: false
 *               error: Error message details
 */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body

  try {
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
        success: false,
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    })

    await newUser.save()

    res.status(201).json({
      message: "User registered successfully",
      success: true,
    })
  } catch (error) {
    console.error(error, "aaaaaaaaaaaaaaa")
    res.status(500).json({
      message: "Error registering user",
      success: false,
      error: error.message,
    })
  }
})

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Log in as a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: john@example.com
 *               password: mysecretpassword
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               message: Login successful
 *               success: true
 *               token: jwt_token
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             example:
 *               message: Invalid email or password
 *               success: false
 *       500:
 *         description: Error logging in
 *         content:
 *           application/json:
 *             example:
 *               message: Error logging in
 *               success: false
 *               error: Error message details
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    })

    res.status(200).json({
      message: "Login successful",
      success: true,
      token,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Error logging in",
      success: false,
      error: error.message,
    })
  }
})

module.exports = router

