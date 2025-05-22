const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MessageSchema = new Schema(
  {
    sender: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    receiver: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    content: {type: String, required: true},
  },
  { timestamps: true }
);

let Message = mongoose.model("Message", MessageSchema)
module.exports = Message;
