const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;

// db schema - transaction list
const transactionSchema = new Schema({
    transactionId: {
        type: String
    },   
    status: {
        type: String
    }, 
    amount: {
        type: Number
    }, 
    currencyIsoCode: {
        type: String
    },    
    paymentInstrumentType: {
        type: String
    },
    paymentMethod: String, 
    payerEmail: String,
    paymentId: String,
    cardType: String,
    maskedNumber: String,
    cardholderName: String, 
    productName: String, 
    productuserName: String,
    currencySymbol: String,
    success: {
        type: Boolean
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    }       
});

transactionSchema.plugin(autoIncrement.plugin, {model: "transaction"});

module.exports = mongoose.model("transaction", transactionSchema);