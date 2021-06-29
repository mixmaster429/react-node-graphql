const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;
autoIncrement.initialize(mongoose.connection);

// db schema - blocked users
const blockSchema = new Schema({
    userFrom: Number,
    userTo: Number,
    timeStamp: {
        type: Date,
        default: Date.now
    }
});

blockSchema.plugin(
    autoIncrement.plugin,
    {
        model: "bUser",
        startAt: 10000
    });

module.exports = mongoose.model("bUser", blockSchema);