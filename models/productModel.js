const mongoose = require("mongoose")
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    categoryType: {
      type: String,
      default: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Assuming you have a Category model
      required: true,
    },
    // You can add more fields specific to products here
  },
  {
    timestamps: true,
  }
)

const productModel = mongoose.model("product", productSchema)

module.exports = productModel

