const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;

// db schema - currency
const currencySchema = new Schema({
    name: {
        type: String
    },
    code: {
        type: String
    },
    symbol: {
        type: String
    },
    rate: {
        type: Number
    },
    status: {
        type: String,
        default: "Active"
    },
    default: {
        type: Boolean,
        default: false
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

currencySchema.plugin(autoIncrement.plugin, {model: "currency"});

module.exports = mongoose.model("currency", currencySchema);