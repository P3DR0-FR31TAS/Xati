let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let scopes = require('./scopes');

let RoleSchema = new Schema({
  name: { type: String, required: true },
  scopes: [{ type: String, enum: [scopes["user"], scopes["admin"]] }]
});

let UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: RoleSchema, required: true },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }]

  },
  { timestamps: true }
);

let User = mongoose.model("User", UserSchema);
module.exports = User;
