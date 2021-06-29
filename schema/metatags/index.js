const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;

// db schema - mata tags
const metatagsSchema = new Schema({
    language: [{
        langCode: {
            type: String,
            default: "en"
        },
        pageTitle: {
            type: String
        },
        metaDescription: {
            type: String
        },
        keywords: {
            type: String
        }
    }],
    pageUrl: {
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

metatagsSchema.plugin(autoIncrement.plugin, {model: "metatags"});

module.exports = mongoose.model("metatags", metatagsSchema);