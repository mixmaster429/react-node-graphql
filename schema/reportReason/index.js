const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;
autoIncrement.initialize(mongoose.connection);

// db schema - report list
const reportReasonSchema = new Schema({

    language: [{
        langCode: {
            type: String,
            default: "en"
        },
        name: {
            type: String
        },
        description: {
            type: String
        }
    }],
    image: String,
    status: {
        type: String,
        default: "Active"
    },
    createdAt: {
        type: Date,
        default:Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

reportReasonSchema.plugin(autoIncrement.plugin, {model: "reason"});

module.exports = mongoose.model("reason", reportReasonSchema);