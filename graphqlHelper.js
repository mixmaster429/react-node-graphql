const { makeExecutableSchema } = require("apollo-server");
const { mergeResolvers } = require("merge-graphql-schemas");

const userSchema = require("./model/user/schema");
const userResolver = require("./model/user/resolver");
const adminSchema = require("./model/admin/schema");
const adminResolver = require("./model/admin/resolver");
const productSchema = require("./model/product/schema");
const siteSchema = require("./model/siteSettings/schema");
const siteResolver = require("./model/siteSettings/resolver");
const productResolver = require("./model/product/resolver");
const categorySchema = require("./model/others/schema");
const categoryResolver = require("./model/others/resolver");
const reviewSchema = require("./model/review/schema");
const reviewResolver = require("./model/review/resolver");
const blockSchema = require("./model/block/schema");
const blockResolver = require("./model/block/resolver");
const uReportSchema = require("./model/userReport/schema");
const uReportResolver = require("./model/userReport/resolver");
const pReportSchema = require("./model/productReport/schema");
const pReportResolver = require("./model/productReport/resolver");
const reasonSchema = require("./model/reportReason/schema");
const reasonResolver = require("./model/reportReason/resolver");
const notificationResolver = require("./model/notification/resolver");
const notificationSchema = require("./model/notification/schema");
const feedbackSchema = require("./model/feedback/schema");
const feedbackResolver = require("./model/feedback/resolver");

const chatResolver = require("./model/chat/resolver");
const chatSchema = require("./model/chat/schema");

const deletechatResolver = require("./model/deleteChat/resolver");
const deletechatSchema = require("./model/deleteChat/schema");
const contactUsResolver = require("./model/contactUs/resolver");
const contactUsSchema = require("./model/contactUs/schema");

const PaymentResolver = require("./model/payment/resolver");
const PaymentSchema = require("./model/payment/schema");

const adBannerResolver = require("./model/adBanner/resolver");
const adBannerSchema = require("./model/adBanner/schema");

const languageResolver = require("./model/language/resolver");
const languageSchema = require("./model/language/schema");

const staticPagesResolver = require("./model/staticPages/resolver");
const staticPagesSchema = require("./model/staticPages/schema");

const metatagsResolver = require("./model/metatags/resolver");
const metatagsSchema = require("./model/metatags/schema");

const adminmailResolver = require("./model/adminmail/resolver");
const adminmailSchema = require("./model/adminmail/schema");

const filterSchema = require("./model/filter/schema");
const filterResolver = require("./model/filter/resolver");

var schema = makeExecutableSchema({
    // combine graphql schemas
    typeDefs: [
        userSchema,
        productSchema,
        categorySchema,
        adminSchema,
        siteSchema,
        reviewSchema,
        blockSchema,
        uReportSchema,
        pReportSchema,
        reasonSchema,
        notificationSchema,
        feedbackSchema,
        chatSchema,
        deletechatSchema,
        contactUsSchema,
        PaymentSchema,
        adBannerSchema,
        languageSchema,  
        staticPagesSchema,
        metatagsSchema,
        adminmailSchema,
        filterSchema
    ],
    // combine graphql resolver functions
    resolvers: mergeResolvers([
        userResolver,
        productResolver,
        categoryResolver, 
        adminResolver,
        siteResolver,
        reviewResolver,
        blockResolver,
        uReportResolver,
        pReportResolver,
        reasonResolver,
        notificationResolver,
        feedbackResolver,
        chatResolver,
        deletechatResolver,
        contactUsResolver,
        PaymentResolver,
        adBannerResolver,
        languageResolver,
        staticPagesResolver,
        metatagsResolver,
        adminmailResolver,
        filterResolver
    ])});

module.exports = schema;