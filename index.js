const express = require("express");
const mongodb = require("mongoose");

const productRoute = require("./routes/product.route");
const userRoute = require("./routes/user.route");
const userRoute2 = require("./routes/user2.route");

const urlMongoDB =
  "mongodb+srv://tai15122003311:XrxTEtyUOf1kIf82@cluster0.933sl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const app = express();

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("welcome to server");
});

app.use("/api/products", productRoute);

app.use("/user", userRoute2);

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
