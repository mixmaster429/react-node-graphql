const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;
autoIncrement.initialize(mongoose.connection);

// db schema - review feedback lists
const languageSchema = new Schema({
    
    name: String,
    value: String,

    status:{
        type: String,
        default:"Active"
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

languageSchema.plugin(autoIncrement.plugin, {model: "language", startAt: 10000});

module.exports = mongoose.model("language", languageSchema);