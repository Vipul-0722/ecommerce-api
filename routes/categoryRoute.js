const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/authMiddleware")
const Category = require("../models/categoryModel")

/**
 * @swagger
 * /api/category/add-category:
 *   post:
 *     summary: Add a new category
 *     security:
 *       - jwtToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category inserted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Category inserted successfully
 *               success: true
 *               data:
 *                 _id: 5f6ad63f0a63873e3c07b4b0
 *                 name: Example Category
 *                 description: Example description
 *       500:
 *         description: Error inserting category
 *         content:
 *           application/json:
 *             example:
 *               message: Error inserting category
 *               success: false
 *               error: Error message details
 */

router.post("/add-category", authMiddleware, async (req, res) => {
  const { name, description } = req.body

  try {
    const newCategory = new Category({
      name,
      description,
    })

    await newCategory.save()

    res.status(201).json({
      message: "Category inserted successfully",
      success: true,
      data: newCategory,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Error inserting category",
      success: false,
      error: error.message,
    })
  }
})

/**
 * @swagger
 * /api/category/get-all-category:
 *   get:
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Categories fetched successfully
 *               success: true
 *               data:
 *                 - _id: 5f6ad63f0a63873e3c07b4b0
 *                   name: Example Category 1
 *                   description: Example description 1
 *                 - _id: 5f6ad63f0a63873e3c07b4b1
 *                   name: Example Category 2
 *                   description: Example description 2
 */
router.get("/get-all-category", authMiddleware, async (req, res) => {
  try {
    const categories = await Category.find({})
    res.status(200).json({
      message: "Categories fetched successfully",
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Error fetching categories",
      success: false,
      error: error.message,
    })
  }
})
module.exports = router

