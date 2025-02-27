const bodyParser = require("body-parser");
const express = require("express");
const Users = require("../data/users");
const cookieParser = require('cookie-parser');
const VerifyToken = require('../middleware/token');

function AuthRouter() {
  let router = express();

  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  router.route("/register").post((req, res) => {
    const body = req.body;
    Users.create(body)
      .then(() => Users.createToken(body))
      .then((response) => {
        res.status(200);
        res.send(response);
      })
      .catch((err) => {
        console.error(err);
        if (err.message === "Email or username already exists") {
          res.status(401).send({ error: err.message })
        } else {
          res.status(500).send({ error: err.message });
        }
      });
  });

  router.route("/login").post((req, res) => {
    let body = req.body;

    return Users.findUser(body)
      .then((user) => {
        return Users.createToken(user);
      })
      .then((response) => {
        res.cookie("token", response.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production'
        });
        console.log(response);
        res.status(200);
        res.send(response);
      })
      .catch((err) => {
        console.error(err);
        if (err.message === "User not found" || err.message === "Password incorrect") {
          res.status(401).send({ error: err.message })
        } else {
          res.status(500).send({ error: err.message });
        }
      });
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
