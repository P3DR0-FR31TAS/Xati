const Messages = require('./messages');
const MessagesService = require('./service');

const service = MessagesService(Messages);

module.exports = service;