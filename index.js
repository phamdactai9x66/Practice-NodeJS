const express = require("express");
const mongodb = require("mongoose");

const Product = require("./models/product.model");

const urlMongoDB = process.env.PRIVATE_KEY;

const app = express();

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("welcome to server");
});

app.post("/api/products", async (req, res) => {
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

app.get("/api/products", async (req, res) => {
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

mongodb
  .connect(urlMongoDB)
  .then((res) => {
    // console.log(res);
    console.log("connect to database");
  })
  .catch((err) => {
    // console.log(err);
    console.log("connect fail");
  });

app.listen(3000, () => {
  console.log("server running in port 3000");
});
