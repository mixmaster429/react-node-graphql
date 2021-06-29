const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;
autoIncrement.initialize(mongoose.connection);

// db schema - delete chat 
const contactUsSchema = new Schema({
    name: String,
    email: String,
    feedback: String,
    timeStamp: {
        type: Date,
        default: Date.now
    }
});

contactUsSchema.plugin(
    autoIncrement.plugin,
    {
        model: "contactUs",
        startAt: 10000
    });

module.exports = mongoose.model("contactUs", contactUsSchema);