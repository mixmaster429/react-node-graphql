const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;

// db schema - timezone
const timezoneSchema = new Schema({
    name: {
        type: String
    },
    value: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

timezoneSchema.plugin(autoIncrement.plugin, {model: "timezone"});

module.exports = mongoose.model("timezone", timezoneSchema);