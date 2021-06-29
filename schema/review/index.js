const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;
autoIncrement.initialize(mongoose.connection);

// db schema - review
const reviewSchema = new Schema({
    userFrom: Number,
    userTo: Number,
    ratings: Number,
    comment: String,
    feedBack: [String],
    createdAt: {
        type: Date,
        default:Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

reviewSchema.plugin(autoIncrement.plugin, {model: "review", startAt: 10000});

module.exports = mongoose.model("review", reviewSchema);