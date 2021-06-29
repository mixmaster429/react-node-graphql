const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;
autoIncrement.initialize(mongoose.connection);

// db schema - reported products
const pReportSchema = new Schema({
    userId: Number,
    productId: Number,
    comments: String,
    timeStamp: {
        type: Date,
        default: Date.now
    }
});

pReportSchema.plugin(autoIncrement.plugin, {model: "pReport", startAt: 10000});

module.exports = mongoose.model("pReport", pReportSchema);