
function MessagesService(MessageModel) {
  
  let service = {
    create,
    save,
    getMessages,
  };

  async function create(message) {
    try{
      message = new MessageModel(message);
      return save(message);
    }
    catch(err) {
      throw new Error("Failed creating the message:");
    }
  }

  async function save(model) {
    try{
      let newMessage = await model.save();
      return newMessage;
    }
    catch(err) {
      throw new Error("Failed saving the message:");
    }
  }

  async function getMessages(user1Id, user2Id) {
    try{
      let messages = await MessagesModel.find({
        $or: [
          { sender: user1Id, receiver: user2Id },
          { sender: user2Id, receiver: user1Id }
        ]
      }).sort({createdAt: 1});
      return messages;
    } catch(err) {
      throw new Error("Failed geting the messages:");
    }
  }

  return service;
}

module.exports = MessagesService;