let AuthAPI = require("./server/auth");
let MessagesAPI = require("./server/messages");

const express = require('express');

function init() {
  let api = express();
  api.use('/auth', AuthAPI());
  api.use('/messages', MessagesAPI());
  return api;
}

module.exports = {
  init: init,
};