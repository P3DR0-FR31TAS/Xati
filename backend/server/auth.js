const bodyParser = require("body-parser");
const express = require("express");
const Users = require("../data/users");
const cookieParser = require('cookie-parser');
const VerifyToken = require('../middleware/token');

function AuthRouter() {
  let router = express();

  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  router.route("/register").post(async (req, res) => {
    const body = req.body;

    try {
      if(!body.email, !body.password, !body.name, !body.role, !body.surName) {
        return res.status(400).send({
          success: false,
          error: "Missing required fields"
        });
      }

      await Users.create(body);
      const token = await Users.createToken(body);

      res.status(200).send({
        success: true,
        message: "User registered successfully",
        token
      });
    }
    catch (err) {
      console.error(err);

      if (err.message === "Email already exists") {
        return res.status(409).send({ 
          success: false,
          message: "Email already exists"
        });
      }

      if (err.message === "Username already exists") {
        return res.status(409).send({ 
          success: false,
          message: "Username already exists"
        });
      }

      res.status(500).send({ 
        success: false,
        message: "User register failed",
        details: "Internal server error",
        error: err.message 
      });
    }
  });

  router.route("/login").post(async (req, res) => {
    const body = req.body;

    try {
      if (!body.email || !body.password) {
        return res.status(400).send({
          success: false,
          error: "Missing required fields"
        });
      }

      let user = await Users.findUser(body);
      let token = Users.createToken(user);

      res.cookie("token", token.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });

      res.status(200).send({
        success: true,
        message: "User logged in successfully",
        token
      });

    } catch (err) {
      console.error(err);
      if (err.message === "User not found") {
        return res.status(401).send({ 
          sucess: false,
          message: "User not found",
        });
      }
      if (err.message === "Password incorrect") {
        return res.status(401).send({ 
          sucess: false,
          message: "Password incorrect",
        });
      }
      return res.status(500).send({ 
        success: false,
        message: "User login failed",
        details: "Internal server error",
        error: err.message 
      });
    }
  });

  router.use(cookieParser());
  router.use(VerifyToken);
  router.route("/logout").get((req, res, next) => {

    res.cookie("token", req.cookies.token, { httpOnly: true, maxAge: 0 });

    res.status(200);
    res.send({ auth: false, logout: true, message: "Loged out successfully" });
    next();
  });

  return router;
}

module.exports = AuthRouter;
