const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const messageSchema = new mongoose.Schema({
  
  message: String,

  room: {
    type: mongoose.Schema.Types.Number, ref: "chat"
  },
  userId: Number,

  profileImage: String,

  readMessage: {
    type: Boolean,
    default: false
},

  createdAt: {
    type: Date,
    default: Date.now
}
});
 messageSchema.plugin(autoIncrement.plugin, {model: "message", startAt: 1, incrementBy: 1});
 module.exports = mongoose.model("message", messageSchema); 