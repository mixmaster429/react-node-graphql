const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;

// db schema - site settings 
const siteSchema = new Schema({
    name: String,
    contactNo: String,
    version: String,
    defaultCurrency: {
        type: String,
        default: "USD"
    },
    defaultUnit: {
        type: String,
        default: "KM"
    },
    favicon: String,
    image: String,
    footerLogo: String,
    footerBatch: String,
    footerBackground: String,
    loginImage: String,
    adminloginImage: String,
    fbLink: String,
    twLink: String,
    utubeLink: String,
    androidLink: String,
    iosLink: String,
    instagramLink: String,
    googleAnalyticKey:String,
    fromAddress: String,
    fromName: String,
    uName: String,
    password: String,
    paymentApi: String,
    googleApi: String,
    facebookAppId: String,
    googleAppId: String,
    admob: String,
    admobBanner: String,
    Environment: String,
    MerchantId: String,
    PublicKey: String,
    PrivateKey: String,
    firebaseJson: String,
    stripeSecretKey: String,
    stripePublishKey: String,
    paypalEnvironment: String,
    paypalAppId: String,
    appleClientId: String,
    appleTeamId: String,
    appleKeyIdentifier: String,
    appleP8File: String,
    braintree: {
        type: Boolean,
        default: false
    },
    stripe: {
        type: Boolean,
        default: false
    },
    paypal: {
        type: Boolean,
        default: false
    }
});

siteSchema.plugin(autoIncrement.plugin, {model: "site", startAt: 10000});

module.exports = mongoose.model("site", siteSchema);

