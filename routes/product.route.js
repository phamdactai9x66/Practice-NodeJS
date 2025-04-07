const express = require("express");

const Product = require("../models/product.model");

const router = express.Router();

router.post("", async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);

    res.status(200).json({
      data: newProduct,
      errorCode: 200,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const editProduct = Product.findByIdAndUpdate(req.params.id, req.body);
    // check product exist before edit product

    if (!editProduct) {
      res.status(400).json({
        errorCode: 400,
        errorMessage: "Product not found",
      });
    }

    res.status(200).json({
      data: {},
      errorCode: 200,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("", async (req, res) => {
  try {
    const products = await Product.find({});

    res.status(200).json({
      data: products,
      errorCode: 200,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const findProduct = await Product.findById(req.params.id);

    res.status(200).json({
      data: findProduct,
      errorCode: 200,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
