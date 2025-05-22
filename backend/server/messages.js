const express = require('express');
const bodyParser = require('body-parser');
const verifyToken = require('../middleware/token');
const Messages = require('../data/messages');

function MessagesRouter() {
  let router = express();

  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  router.use(verifyToken);
  router.route("/:user1Id/:user2Id")
    .get(async (req, res) => {
      const { user1Id, user2Id } = req.params;

      try {
        if (!user1Id || !user2Id) {
          return res.status(400).send({
            success: false,
            message: "Missing users Ids"
          });
        }

        let messages = await Messages.getMessages(user1Id, user2Id);
        return res.status(200).send({
          success: true,
          data: messages
        });

      } catch (err) {
        console.log(err);
        return res.status(500).send({
          success: false,
          message: "Error getting the messages",
          error: err.message
        });
      }
    });

  router.route("/")
    .post(async (req, res) => {
      const body = req.body;

      const { user1Id, user2Id, content } = body;

      try {
        if (!user1Id || !user2Id || !content) {
          return res.status(400).send({
            success: false,
            message: "Missing required fields"
          });
        }

        await Messages.create(body);

        return res.status(200).send({
          success: true,
          message: "Message created successfully"
        });

      } catch (err) {
        return res.status(500).send({
          success: false,
          message: "Error creating message",
          error: err.message
        })
      }
    });

  return router;
}

module.exports = MessagesRouter;
