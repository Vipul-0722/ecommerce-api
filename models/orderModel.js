const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Assuming you have a Product model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      default: "Pending", // You can add more status options (e.g., 'Shipped', 'Delivered')
    },
  },
  {
    timestamps: true,
  }
)

const orderModel = mongoose.model("order", orderSchema)

module.exports = orderModel

