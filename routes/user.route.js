const express = require("express");

const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const body = req.body;

    const newUser = await User.create(body);

    if (!Object.values(newUser).length) {
      res.status(400).json({
        errorCode: 400,
        errorMessage: "User not found",
      });
    }

    res.status(200).json({
      data: newUser,
      errorCode: 200,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json({
      data: user,
      errorCode: 200,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({
        errorCode: 400,
        errorMessage: "Body is invalid",
      });
    }

    const findUser = await User.findOne({ username });

    if (!Object.values(findUser).length) {
      res.status(400).json({
        errorCode: 400,
        errorMessage: "User not found",
      });
    }

    const { username: username2, full_name, _id } = findUser || {};

    const userInfo = {
      username: username2,
      full_name,
      _id,
    };

    const genToken = jwt.sign(userInfo, process.env.PRIVATE_KEY_JWT, {
      //   algorithm: "RS256",
      expiresIn: 60,
    });

    const refreshToken = jwt.sign(userInfo, process.env.PRIVATE_KEY_JWT, {
      //   algorithm: "RS256",
      expiresIn: "30d",
    });

    res.json({
      data: findUser,
      accessToken: genToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
