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
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const productModel = mongoose.model("product", productSchema)

module.exports = productModel

