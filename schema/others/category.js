const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;

// db schema - category
const categorySchema = new Schema({
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
    status: {
        type: String,
        default: "Active"     
    },
    image: {  
        type: String 
    },
    fields: [{
        filterId: Number,
        isMandatory: {
            type: Number,  
        }
    }], 
    createdAt: {
        type: Date,
        default  : Date.now
    },
    updatedAt: { 
        type: Date,
        default: Date.now   
    }, 
    isFeatured: { 
        type: Boolean,  
        default: false
    }
});

categorySchema.plugin(autoIncrement.plugin, {model: "category", startAt: 10000});

module.exports = mongoose.model("category", categorySchema);