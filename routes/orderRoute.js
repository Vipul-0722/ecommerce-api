const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/authMiddleware")
const User = require("../models/userModel")
const Order = require("../models/orderModel")

/**
 * @swagger
 * /api/order/place-order:
 *   post:
 *     summary: Place an order
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
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Order placed successfully
 *               success: true
 *               data:
 *                 _id: 5f6ad63f0a63873e3c07b4b0
 *                 user: 5f6ad63f0a63873e3c07b4b1
 *                 products:
 *                   - product: 5f6ad63f0a63873e3c07b4b2
 *                     quantity: 2
 *                   - product: 5f6ad63f0a63873e3c07b4b3
 *                     quantity: 1
 */
router.post("/place-order", authMiddleware, async (req, res) => {
  const userId = req.body.id

  try {
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      })
    }

    if (user.cart.length === 0) {
      return res.status(400).json({
        message: "Cart is empty. Cannot place an order.",
        success: false,
      })
    }

    const orderProducts = user.cart.map((cartItem) => ({
      product: cartItem.productId._id,
      quantity: cartItem.quantity,
    }))

    const order = new Order({
      user: userId,
      products: orderProducts,
    })

    await order.save()

    user.cart = []
    await user.save()

    res.status(201).json({
      message: "Order placed successfully",
      success: true,
      data: order,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Error placing the order",
      success: false,
      error: error.message,
    })
  }
})
/**
 * @swagger
 * /api/order/order-history:
 *   get:
 *     summary: Get order history for a user
 *     security:
 *       - jwtToken: []
 *     responses:
 *       200:
 *         description: Order history fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Order history fetched successfully
 *               success: true
 *               data:
 *                 - _id: 5f6ad63f0a63873e3c07b4b0
 *                   user: 5f6ad63f0a63873e3c07b4b1
 *                   products:
 *                     - product: 5f6ad63f0a63873e3c07b4b2
 *                       quantity: 2
 *                     - product: 5f6ad63f0a63873e3c07b4b3
 *                       quantity: 1
 *                 - _id: 5f6ad63f0a63873e3c07b4b4
 *                   user: 5f6ad63f0a63873e3c07b4b1
 *                   products:
 *                     - product: 5f6ad63f0a63873e3c07b4b5
 *                       quantity: 3
 */
router.get("/order-history", authMiddleware, async (req, res) => {
  const userId = req.body.id

  try {
    const orders = await Order.find({ user: userId })
    res.status(200).json({
      message: "Order history fetched successfully",
      success: true,
      data: orders,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Error fetching order history",
      success: false,
      error: error.message,
    })
  }
})

/**
 * @swagger
 * /api/order/order-details/{orderId}:
 *   get:
 *     summary: Get order details by order ID
 *     security:
 *       - jwtToken: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: ID of the order to retrieve details for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Order details fetched successfully
 *               success: true
 *               data:
 *                 _id: 5f6ad63f0a63873e3c07b4b0
 *                 user: 5f6ad63f0a63873e3c07b4b1
 *                 products:
 *                   - product: 5f6ad63f0a63873e3c07b4b2
 *                     quantity: 2
 *                   - product: 5f6ad63f0a63873e3c07b4b3
 *                     quantity: 1
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             example:
 *               message: Order not found
 *               success: false
 *       500:
 *         description: Error fetching order details
 *         content:
 *           application/json:
 *             example:
 *               message: Error fetching order details
 *               success: false
 *               error: Error message details
 */

router.get("/order-details/:orderId", authMiddleware, async (req, res) => {
  const orderId = req.params.orderId
  try {
    const order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
      })
    }

    res.status(200).json({
      message: "Order details fetched successfully",
      success: true,
      data: order,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Error fetching order details",
      success: false,
      error: error.message,
    })
  }
})

module.exports = router

