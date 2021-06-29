const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const chatSchema = new mongoose.Schema({

  userId: {
     type: Number
  },
  productId: {
      type: Number
  },
  productuserId: {
      type: Number
  },  
  groupName:{
      type: String,
      unique:true
  },
  createdAt: {
      type: Date,
      default: Date.now
}
 
//   userId: Number,
//   productId: Number,
//   groupId: String,
//   groupName: String,
//   productUser: Number
});
chatSchema.plugin(autoIncrement.plugin, {model: "chat", startAt: 1, incrementBy: 1});
module.exports = mongoose.model("chat", chatSchema); 

