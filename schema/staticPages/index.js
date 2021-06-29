const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;

// db schema - static Pages
const staticPagesSchema = new Schema({
    language: [{
        langCode: {
            type: String,
            default: "en"
        },
        title: {
            type: String
        },
        content: {
            type: String
        }
    }],
    url: {
        type: String
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
    },    
});

staticPagesSchema.plugin(autoIncrement.plugin, {model: "staticPages"});

module.exports = mongoose.model("staticPages", staticPagesSchema);