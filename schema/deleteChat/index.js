const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;
autoIncrement.initialize(mongoose.connection);

// db schema - delete chat 
const deletechatSchema = new Schema({
    userFrom: Number,
    userTo: Number,
    chatroomId: Number,
    timeStamp: {
        type: Date,
        default: Date.now
    }
});

deletechatSchema.plugin(
    autoIncrement.plugin,
    {
        model: "deleteChat",
        startAt: 10000
    });

module.exports = mongoose.model("deleteChat", deletechatSchema);