const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;

// db schema - ad banner
const adBannerSchema = new Schema({    
    name: String,
    webBannerImage: String,
    mobileBannerImage: String,
    bannerUrl: String, 
    status: {
        type: String,
        default: "Active"
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },   
    createdAt: {
        type: Date,
        default: Date.now
    }             
});

adBannerSchema.plugin(autoIncrement.plugin, {model: "adBanner"});

module.exports = mongoose.model("adBanner", adBannerSchema);


