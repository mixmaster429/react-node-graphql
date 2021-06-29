const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;
autoIncrement.initialize(mongoose.connection);

// db schema - black listed tokens
const blSchema = new Schema({
    token: String
});

blSchema.plugin(autoIncrement.plugin, {model: "blackList"});

module.exports = mongoose.model("blackList", blSchema);