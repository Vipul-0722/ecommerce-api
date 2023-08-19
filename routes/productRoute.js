const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/authMiddleware")
const Category = require("../models/categoryModel")
const Product = require("../models/productModel")

/**
 * @swagger
 * /api/product/add-product:
 *   post:
 *     summary: Add a new product
 *     security:
 *       - jwtToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               availability:
 *                 type: boolean
 *               categoryType:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product inserted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Product inserted successfully
 *               success: true
 *               data:
 *                 _id: 5f6ad63f0a63873e3c07b4b0
 *                 title: Example Product
 *                 price: 100
 *                 description: Example product description
 *                 availability: true
 *                 categoryId: 5f6ad63f0a63873e3c07b4b1
 */
router.post("/add-product", authMiddleware, async (req, res) => {
  const { title, price, description, availability, categoryType } = req.body

  try {
    const category = await Category.findOne({ name: categoryType })

    if (!category) {
      return res.status(400).json({
        message: "Invalid category type",
        success: false,
      })
    }

    const newProduct = new Product({
      title,
      price,
      description,
      availability,
      categoryId: category._id,
    })

    await newProduct.save()

    res.status(201).json({
      message: "Product inserted successfully",
      success: true,
      data: newProduct,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Error inserting product",
      success: false,
      error: error.message,
    })
  }
})

/**
 * @swagger
 * /api/product/get-products-by-category/{categoryId}:
 *   get:
 *     summary: Get products by category
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: ID of the category for which to retrieve products
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Products fetched successfully
 *               success: true
 *               data:
 *                 - title: Example Product 1
 *                   price: 49.99
 *                   description: Example product description 1
 *                   availability: true
 *                 - title: Example Product 2
 *                   price: 29.99
 *                   description: Example product description 2
 *                   availability: false
 *       500:
 *         description: Error fetching products
 *         content:
 *           application/json:
 *             example:
 *               message: Error fetching products
 *               success: false
 *               error: Error message details
 */
router.get("/get-products-by-category/:categoryId", async (req, res) => {
  const categoryId = req.params.categoryId

  try {
    const products = await Product.find({ categoryId }) // Assuming your product schema has a categoryId field
    const essentialProductDetails = products.map((product) => ({
      title: product.title,
      price: product.price,
      description: product.description,
      availability: product.availability,
    }))

    res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      data: essentialProductDetails,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Error fetching products",
      success: false,
      error: error.message,
    })
  }
})

/**
 * @swagger
 * /api/product/get-product-details/{productId}:
 *   get:
 *     summary: Get product details by ID
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID of the product to retrieve details for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Product details fetched successfully
 *               success: true
 *               data:
 *                 _id: 5f6ad63f0a63873e3c07b4b0
 *                 title: Example Product
 *                 price: 49.99
 *                 description: Example product description
 *                 availability: true
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             example:
 *               message: Product not found
 *               success: false
 *       500:
 *         description: Error fetching product details
 *         content:
 *           application/json:
 *             example:
 *               message: Error fetching product details
 *               success: false
 *               error: Error message details
 */
router.get("/get-product-details/:productId", async (req, res) => {
  const productId = req.params.productId

  try {
    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      })
    }

    res.status(200).json({
      message: "Product details fetched successfully",
      success: true,
      data: product,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Error fetching product details",
      success: false,
      error: error.message,
    })
  }
})

module.exports = router

