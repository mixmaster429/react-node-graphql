const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;
autoIncrement.initialize(mongoose.connection);

// db schema - review feedback lists
const FeedBackSchema = new Schema({
    name: String,
    description: String,
    feedbackType: {
        type: String,
        default: "primary"
    },
    status: { 
        type: String,
        default: "Active"
    },
    createdAt:{            
        type: Date ,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

FeedBackSchema.plugin(autoIncrement.plugin, {model: "feedBack", startAt: 10000});

module.exports = mongoose.model("feedBack", FeedBackSchema);