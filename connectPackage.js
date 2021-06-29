const mongoose = require("mongoose");
const {DB_Name, DB_Password, DB_Username} = process.env;

 // DB schema
 const {
    user,
    product,
    category,
    timezone,
    currency,
    country,
    admin,
    chat,
    site,
    review,
    bUser,
    uReport,
    pReport,
    reason,
    notification,
    feedBack,
    message,
    mailtemp,
    deleteChat,
    contactUs,
    featured,
    adBanner,
    language,
    staticPages,
    metatags,
    filterCategory
} = require("./dbSchema");

// default seed scripts to be inserted
const {
    categorySeed,
    timezoneSeed,
    currencySeed,
    countrySeed,
    userSeed,
    productSeed,
    adminSeed,
    siteSeed,
    reportSeed,
    reviewSeed,
    blockSeed,
    uReportSeed,
    pReportSeed,
    notificationSeed,
    feedBackSeed,
    mailtempSeed,
    deletechatSeed,
    contactUsSeed,
    featuredSeed,
    adBannerSeed,
    languageSeed,
    staticPagesSeed,
    metatagsSeed,
    filterSeed
} = require("./seedScript");


const seedToInsert = [
    {key: admin, value: adminSeed},
    //{key: category, value: categorySeed},
    {key: timezone, value: timezoneSeed},
    {key: currency, value: currencySeed},
    {key: country, value: countrySeed},
    {key: site, value: siteSeed},
    {key: reason, value: reportSeed},
    {key: mailtemp, value:mailtempSeed},
    {key: featured, value: featuredSeed},
    {key: adBanner, value: adBannerSeed},
    {key: language, value: languageSeed},
    {key: staticPages, value: staticPagesSeed},
    {key: metatags, value: metatagsSeed},
    //{key: filterCategory, value: filterSeed}
];

// const seedToRemove = [
//    user,
//    product,
//    bUser,
//    review,
//    uReport,
//    pReport,
//    notification,
//    feedBack,
//    deleteChat,
//    contactUs,
//    filterCategory,
//    category   
// ];

// connect MongoDB
var connect =mongoose.connect(`mongodb://${DB_Username}:${DB_Password}@localhost/${DB_Name}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(async () => {
    // for(var i=0; i<seedToRemove.length; i++) {
    //      await seedToRemove[i].deleteMany();
    // }
// write seed data to DB while server re-runs.
for(i=0; i<seedToInsert.length; i++) {
    var found = await seedToInsert[i].key.find();
    if (!found.length) {
        seedToInsert[i].key.create(seedToInsert[i].value);
    }
}
})
.then(() => {
console.log("Connection Package established with MongoDB");
const notify = require("./pushNotificationConfig");
notify.callPushnotification();
}).catch((err) => {
throw new Error(err); 
});

module.exports = connect;