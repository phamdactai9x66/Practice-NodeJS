const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    quantity: {
      type: Number,
      required: [true, "quantity is required"],
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "price is required"],
      default: 0,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
