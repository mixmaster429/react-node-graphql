const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;

// db schema - featured list
const featuredSchema = new Schema({

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
    price: {
        type: Number
    }, 
    currencyCode: String,
    currencySymbol: String,
    status: {
        type: String,
        default: "Active"
    },  
    validationPeriod: {
        type: Number
    },  
    image: {
        type: String     
    },
    createdAt : {
        type: Date, 
        default: Date.now     
    },
    updatedAt: {
        type: Date,
        default: Date.now       
    }                                   
}); 

featuredSchema.plugin(autoIncrement.plugin, {model: "featured"});

module.exports = mongoose.model("featured", featuredSchema);