const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;
autoIncrement.initialize(mongoose.connection);


const reportSchema = new Schema({
    imageUrl: String,
    reportName: String,
    description: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

reportSchema.plugin(autoIncrement.plugin, {model: "report", startAt: 1});


module.exports = mongoose.model("report", reportSchema);