const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;

// db schema - country
const countrySchema = new Schema({
    shortName: {
        type: String
    },
    longName: {
        type: String
    },
    iso3: {
        type: String
    },
    numberCode: {
        type: Number
    },
    phoneCode: {
        type: Number
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

countrySchema.plugin(autoIncrement.plugin, {model: "country"});

module.exports = mongoose.model("country", countrySchema);