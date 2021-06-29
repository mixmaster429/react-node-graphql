const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;
autoIncrement.initialize(mongoose.connection);

// db schema - reported users
const uReportSchema = new Schema({
    userFrom: Number,
    userTo: Number,
    comments: String,
    reportId: Number,
    timeStamp: {
        type: Date,
        default: Date.now
    }
});

uReportSchema.plugin(autoIncrement.plugin, {
    model: "uReport",
    startAt: 10000
});

module.exports = mongoose.model("uReport", uReportSchema);