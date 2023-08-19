const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/authMiddleware")
const Category = require("../models/categoryModel")
const Product = require("../models/productModel")
const User = require("../models/userModel")

/**
 * @swagger
 * /api/cart/add-to-cart/{productId}:
 *   post:
 *     summary: Add a product to the user's cart
 *     security:
 *       - jwtToken: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID of the product to add to the cart
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Product added to cart successfully
 *               success: true
 *       404:
 *         description: User not found or Product not found
 *         content:
 *           application/json:
 *             example:
 *               message: User not found or Product not found
 *               success: false
 *       500:
 *         description: Error adding product to cart
 *         content:
 *           application/json:
 *             example:
 *               message: Error adding product to cart
 *               success: false
 *               error: Error message details
 */
router.post("/add-to-cart/:productId", authMiddleware, async (req, res) => {
  const userId = req.body.id
  const productId = req.params.productId

  try {
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      })
    }

    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      })
    }

    const cartItem = {
      productId: product._id,
      quantity: 1,
    }

    user.cart.push(cartItem)
    await user.save()

    res.status(200).json({
      message: "Product added to cart successfully",
      success: true,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Error adding product to cart",
      success: false,
      error: error.message,
    })
  }
})
/**
 * @swagger
 * /api/cart/view-cart:
 *   get:
 *     summary: View user's cart
 *     security:
 *       - jwtToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Cart retrieved successfully
 *               success: true
 *               data:
 *                 - productId: 5f6ad63f0a63873e3c07b4b2
 *                   quantity: 2
 *                 - productId: 5f6ad63f0a63873e3c07b4b3
 *                   quantity: 1
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               message: User not found
 *               success: false
 *       500:
 *         description: Error retrieving cart
 *         content:
 *           application/json:
 *             example:
 *               message: Error retrieving cart
 *               success: false
 *               error: Error message details
 */

router.get("/view-cart", authMiddleware, async (req, res) => {
  const userId = req.body.id

  try {
    const user = await User.findById(userId).populate("cart")

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      })
    }

    res.status(200).json({
      message: "Cart retrieved successfully",
      success: true,
      data: user.cart,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Error retrieving cart",
      success: false,
      error: error.message,
    })
  }
})

/**
 * @swagger
 * /api/cart/update-cart/{productId}:
 *   put:
 *     summary: Update quantity of a product in the cart
 *     security:
 *       - jwtToken: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID of the product in the cart to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Cart updated successfully
 *               success: true
 *       404:
 *         description: User not found or Product not found in cart
 *         content:
 *           application/json:
 *             example:
 *               message: User not found or Product not found in cart
 *               success: false
 *       500:
 *         description: Error updating cart
 *         content:
 *           application/json:
 *             example:
 *               message: Error updating cart
 *               success: false
 *               error: Error message details
 */
router.put("/update-cart/:productId", authMiddleware, async (req, res) => {
  const userId = req.body.id
  const productId = req.params.productId
  const newQuantity = req.body.quantity

  try {
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      })
    }

    const cartItemIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId
    )

    if (cartItemIndex !== -1) {
      user.cart[cartItemIndex].quantity = newQuantity
      await user.save()
      res.status(200).json({
        message: "Cart updated successfully",
        success: true,
      })
    } else {
      res.status(404).json({
        message: "Product not found in cart",
        success: false,
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Error updating cart",
      success: false,
      error: error.message,
    })
  }
})

/**
 * @swagger
 * /api/cart/remove-from-cart/{productId}:
 *   delete:
 *     summary: Remove a product from the user's cart
 *     security:
 *       - jwtToken: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID of the product to remove from the cart
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product removed from cart successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Product removed from cart successfully
 *               success: true
 *       404:
 *         description: Product not found in cart or User not found
 *         content:
 *           application/json:
 *             example:
 *               message: Product not found in cart or User not found
 *               success: false
 *       500:
 *         description: Error removing product from cart
 *         content:
 *           application/json:
 *             example:
 *               message: Error removing product from cart
 *               success: false
 *               error: Error message details
 */
router.delete(
  "/remove-from-cart/:productId",
  authMiddleware,
  async (req, res) => {
    const userId = req.body.id
    const productId = req.params.productId

    try {
      const user = await User.findById(userId)

      if (!user) {
        return res.status(404).json({
          message: "User not found",
          success: false,
        })
      }

      const cartItemIndex = user.cart.findIndex(
        (item) => item.productId.toString() === productId
      )

      if (cartItemIndex !== -1) {
        user.cart.splice(cartItemIndex, 1)
        await user.save()
        res.status(200).json({
          message: "Product removed from cart successfully",
          success: true,
        })
      } else {
        res.status(404).json({
          message: "Product not found in cart",
          success: false,
        })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({
        message: "Error removing product from cart",
        success: false,
        error: error.message,
      })
    }
  }
)
module.exports = router

