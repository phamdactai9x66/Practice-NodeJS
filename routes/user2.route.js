const express = require("express");

const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

const { getUser } = require("../utils");
const { route } = require("./user.route");

const router = express.Router();

function verifyJWT(token) {
  try {
    return {
      payload: jwt.verify(token, process.env.PRIVATE_KEY_JWT),
      expired: false,
    };
  } catch (error) {
    if (error.name == "TokenExpiredError") {
      return { payload: jwt.decode(token), expired: true };
    }
    throw error;
  }
}

router.post("/register", async (req, res) => {
  try {
    const { username: username2 } = req.body;

    const username = username2.toLowerCase();

    const checkExist = await getUser(username);

    //   User already exist
    if (checkExist)
      return res.status(400).send({
        message: "User already exist",
      });

    // optional: user can has password or not
    const body = {
      ...req.body,
      username,
    };

    // insert user into database
    const newUser = await User.create(body);

    res.send({
      data: newUser,
      errorCode: 200,
    });
  } catch (error) {
    res.send({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username: username2 } = req.body;

    const username = username2.toLowerCase();

    const password = req.body.password;

    const findUser = await getUser(username);

    if (!findUser)
      return res.status(401).send({
        errorCode: 401,
        errorMessage: "User not exist",
      });

    // you could hash password before compare
    const comparePassword = findUser.password === password;

    if (!comparePassword)
      return res.status(401).send({
        errorCode: 401,
        errorMessage: "Password incorrect",
      });

    const genAccessToken = jwt.sign(
      {
        username: findUser.username,
        full_name: findUser.full_name,
        _id: findUser._id,
      },
      process.env.PRIVATE_KEY_JWT,
      {
        expiresIn: "30m",
      }
    );

    let refreshToken = findUser.refresh_token;

    // check refresh token in database and check token is expired yed

    // const checkExpired = verifyJWT(findUser.refresh_token).expired;

    // console.log(checkExpired);

    if (!findUser.refresh_token) {
      const genRefreshToken = jwt.sign(
        {
          username: findUser.username,
          full_name: findUser.full_name,
          _id: findUser._id,
        },
        process.env.PRIVATE_KEY_JWT,
        {
          expiresIn: "30d",
        }
      );

      refreshToken = genRefreshToken;

      await User.findByIdAndUpdate(findUser._id, {
        refresh_token: genRefreshToken,
      });
    }

    res.send({
      message: "login success",
      access_token: genAccessToken,
      refresh_token: refreshToken,
      user: findUser.username,
    });
  } catch (error) {
    res.send({ error: error.message });
  }
});

router.post("/refresh_token", async (req, res) => {
  try {
    const accessTokenHeader = req.headers.authorization;

    const refreshToken = req.body.refresh_token;

    // check access token in headers
    if (!accessTokenHeader)
      return res.status(401).send({
        errorCode: 401,
        errorMessage: "Access token not found",
      });

    const parseAccessToken = jwt.verify(
      accessTokenHeader,
      process.env.PRIVATE_KEY_JWT
    );

    // check access token in headers
    if (!parseAccessToken) {
      return res.status(401).send({
        errorCode: 401,
        errorMessage: "Access token invalid",
      });
    }

    if (!refreshToken) {
      return res.status(401).send({
        errorCode: 401,
        errorMessage: "Refresh token not found",
      });
    }

    const findUser = await getUser(parseAccessToken.username);

    if (!findUser) {
      return res.status(400).send({
        errorCode: 400,
        message: "User not found",
      });
    }

    if (findUser.refresh_token !== refreshToken) {
      return res.status(401).send({
        errorCode: 401,
        message: "Refresh token invalid",
      });
    }

    const genAccessToken = jwt.sign(
      {
        username: findUser.username,
        full_name: findUser.full_name,
        _id: findUser._id,
      },
      process.env.PRIVATE_KEY_JWT,
      {
        expiresIn: "30m",
      }
    );

    if (!genAccessToken) {
      return res.send({
        errorCode: 401,
        message: "Generate access token failed",
      });
    }

    res.send({
      access_token: genAccessToken,
      user: findUser.username,
    });
  } catch (error) {
    res.send({ error: error.message });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const accessTokenHeader = req.headers.authorization;

    if (!accessTokenHeader) {
      return res.send(401).send({
        errorCode: 401,
        errorMessage: "Access token is not found",
      });
    }

    const parseAccessToken = jwt.verify(
      accessTokenHeader,
      process.env.PRIVATE_KEY_JWT
    );

    // check access token in headers
    if (!parseAccessToken) {
      return res.status(401).send({
        errorCode: 401,
        errorMessage: "Access token invalid",
      });
    }

    const findUser = await getUser(parseAccessToken.username);

    if (!findUser) {
      return res.status(400).send({
        errorCode: 400,
        message: "User not found",
      });
    }

    await User.findByIdAndUpdate(findUser._id, {
      refresh_token: "",
    });

    res.send({
      message: "Logout success",
    });
  } catch (error) {
    res.send({ error: error.message });
  }
});

module.exports = router;
