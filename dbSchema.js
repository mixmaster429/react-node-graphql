const user = require("./schema/user");
const admin = require("./schema/admin");
const review = require("./schema/review");
const product = require("./schema/product");
const chat = require("./schema/chat/index");
const site = require("./schema/siteSettings");
const category = require("./schema/others/category");
const timezone = require("./schema/others/timezone");
const currency = require("./schema/others/currency");
const country = require("./schema/others/country");
const bUser = require("./schema/block");
const uReport = require("./schema/userReport");
const pReport = require("./schema/productReport");
const reason = require("./schema/reportReason");
const notification = require("./schema/notification");
const blackList = require("./schema/blTokens");
const feedBack = require("./schema/feedback");
const message = require("./schema/message");
const mailtemp = require("./schema/mailtemp");
const deleteChat = require("./schema/deleteChat");
const contactUs = require("./schema/contactUs");
const featured = require("./schema/others/featured");
const transaction = require("./schema/others/transaction");
const adBanner = require("./schema/adBanner");
const language = require("./schema/language");
const staticPages = require("./schema/staticPages/index");
const metatags = require("./schema/metatags/index");
const failedmail = require("./schema/failedmail/index");
const filterCategory = require("./schema/others/filterCategory");

//grouping all db schemas
module.exports = {
    user,
    product,
    category,
    timezone,
    currency,
    country,
    chat,
    admin,
    site,
    review,
    bUser,
    uReport,
    pReport,
    reason,
    feedBack,
    message,
    mailtemp,
    deleteChat,
    contactUs,
    featured,
    transaction, 
    adBanner,
    language,
    staticPages,
    metatags,
    failedmail,
    notification,
    blackList,
    filterCategory
};