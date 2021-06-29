const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;

// db schema - filter
const filterSchema = new Schema({
    language: [{
        langCode: {
            type: String,
            default: "en"
        },
        name: {
            type: String,
            required: true
        },
        values: [{
            valueParent: {
                type: String
            },
            valueChild: [{
                valueChildData: String
            }]
        }]
    }],
    min: Number,
    max: Number,
    inputTag: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Active"
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

filterSchema.plugin(autoIncrement.plugin, {model: "filterCategory"});
module.exports = mongoose.model("filterCategory", filterSchema);