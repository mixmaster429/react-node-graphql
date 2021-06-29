const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;
autoIncrement.initialize(mongoose.connection);

// db schema - mailtemp
const mailtempSchema = new Schema({
    title: {
        type: String,
        // required: true
    },
    mailcontent: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },

    status: {
        type: String,   
        default: "Active"   
    }     
});

mailtempSchema.plugin(autoIncrement.plugin, {model: "mailtemp", startAt: 10000});

module.exports = mongoose.model("mailtemp", mailtempSchema);