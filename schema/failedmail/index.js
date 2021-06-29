const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;

// db schema - static Pages
const failedmailSchema = new Schema({
    
    emailAddress: Array,
    subject: String,
    content: String,        
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },    
});

failedmailSchema.plugin(autoIncrement.plugin, {model: "failedmail"});

module.exports = mongoose.model("failedmail", failedmailSchema);