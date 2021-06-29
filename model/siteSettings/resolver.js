const {errors} = require("../../error");
var fs = require("fs");
var path = require("path");
var { AuthenticationError, ForbiddenError, UserInputError } = require("apollo-server");
const {storeUpload, deleteImage} = require("../../handler");
const URL = process.env.URL;
var admin = require("firebase-admin");


const resolvers = {
    Query: {
        // get informations of the site
        getSiteInfo: async (root, args, {currentUser, site, req}) => {
            var foundSetting;
            if(currentUser) {
                foundSetting = await site.findOne();
            }
            else {
                foundSetting = await site.findOne({}, "image favicon footerLogo footerBatch loginImage adminloginImage footerBackground name contactNo defaultCurrency iosLink androidLink");
            }
            if(foundSetting.image) {
                foundSetting.image = `${URL+req.headers.host}/fileStorage/uploads/site/images/${foundSetting.image}`;
            }
            if (foundSetting.favicon) {
                foundSetting.favicon = `${URL+req.headers.host}/fileStorage/uploads/site/favicons/${foundSetting.favicon}`;
            }
            if (foundSetting.footerLogo) {
                foundSetting.footerLogo = `${URL+req.headers.host}/fileStorage/uploads/site/footers/${foundSetting.footerLogo}`;
            }
            if (foundSetting.footerBatch) {
                foundSetting.footerBatch = `${URL+req.headers.host}/fileStorage/uploads/site/footerBatch/${foundSetting.footerBatch}`;
            }
            if (foundSetting.footerBackground) {
                foundSetting.footerBackground = `${URL+req.headers.host}/fileStorage/uploads/site/footerBackground/${foundSetting.footerBackground}`;
            }
            if (foundSetting.firebaseJson) {
                foundSetting.firebaseJson = foundSetting.firebaseJson;
            }
            if(foundSetting.appleP8File){
                foundSetting.appleP8File = foundSetting.appleP8File;
            }
            if (foundSetting.loginImage) {
                foundSetting.loginImage = `${URL+req.headers.host}/fileStorage/uploads/site/loginImage/${foundSetting.loginImage}`;
            }
            if (foundSetting.adminloginImage) {
                foundSetting.adminloginImage = `${URL+req.headers.host}/fileStorage/uploads/site/adminloginImage/${foundSetting.adminloginImage}`;
            }
            return foundSetting;
        }
    },
    Mutation: {
        // update the site informations 
        updateSiteInfo: async (root, {data}, {currentUser, site, currency}) => {
            if (currentUser.adminUserId) {
                var fileName;
                if (data.defaultCurrency) {
                    await currency.findOneAndUpdate({default: "1"}, {default: "0"});
                    await currency.findOneAndUpdate({code: data.defaultCurrency}, {default: "1"});
                }
                if (data.image) {
                    const { stream, filename } = await data.image;
                    let ext = filename.split(".")[1];
                    fileName = `siteImage_${new Date().getTime()}.${ext}`;
                    await storeUpload({ stream }, fileName, "images", "site");
                    data.image = fileName;
                }
                if (data.favicon) {
                    const { stream, filename } = await data.favicon;
                    let ext = filename.split(".")[1];
                    fileName = `favicon_${new Date().getTime()}.${ext}`;
                    await storeUpload({ stream }, fileName, "favicons", "site");
                    data.favicon = fileName;
                }
                if (data.footerLogo) {
                    const { stream, filename } = await data.footerLogo;
                    let ext = filename.split(".")[1];
                    fileName = `footer_${new Date().getTime()}.${ext}`;
                    await storeUpload({ stream }, fileName, "footers", "site");
                    data.footerLogo = fileName;
                }
                if (data.footerBatch) {
                    const { stream, filename } = await data.footerBatch;
                    let ext = filename.split(".")[1];
                    fileName = `footerBatch_${new Date().getTime()}.${ext}`;
                    await storeUpload({ stream }, fileName, "footerBatch", "site");
                    data.footerBatch = fileName;
                }
                if (data.footerBackground) {
                    const { stream, filename } = await data.footerBackground;
                    let ext = filename.split(".")[1];
                    fileName = `footerBackground_${new Date().getTime()}.${ext}`;
                    await storeUpload({ stream }, fileName, "footerBackground", "site");
                    data.footerBackground = fileName;
                }
                if (data.loginImage) {
                    const { stream, filename } = await data.loginImage;
                    let ext = filename.split(".")[1];
                    fileName = `loginImage_${new Date().getTime()}.${ext}`;
                    await storeUpload({ stream }, fileName, "loginImage", "site");
                    data.loginImage = fileName;
                }
                if (data.adminloginImage) {
                    const { stream, filename } = await data.adminloginImage;
                    let ext = filename.split(".")[1];
                    fileName = `adminloginImage${new Date().getTime()}.${ext}`;
                    await storeUpload({ stream }, fileName, "adminloginImage", "site");
                    data.adminloginImage = fileName;
                }

                if (data.appleP8File) {
                    const { stream, filename } = await data.appleP8File;
                    await storeUpload({ stream }, filename, "authp8File", "appleAuth");
                    data.appleP8File = filename;
                }
                if(data.braintree === true) {
                    if(data.Environment === null || typeof(data.Environment) === "undefined") {
                        throw new Error("Braintree Environment field is required");
                    }
                    if(data.MerchantId === null || typeof(data.MerchantId) === "undefined") {
                        throw new Error("Braintree MerchantId field is required");
                    }
                    if(data.PublicKey === null || typeof(data.PublicKey) === "undefined") {
                        throw new Error("Braintree PublicKey field is required");
                    }
                    if(data.PrivateKey === null || typeof(data.PrivateKey) === "undefined") {
                        throw new Error("Braintree PrivateKey field is required");
                    }
                }

                if(data.stripe === true) {
                    if(data.stripeSecretKey === null || typeof(data.stripeSecretKey) === "undefined") {
                        throw new Error("Stripe stripeSecretKey field is required");
                    }
                    if(data.stripePublishKey === null || typeof(data.stripePublishKey) === "undefined") {
                        throw new Error("Stripe stripePublishKey field is required");
                    }                  
                }

                if(data.paypal === true) {
                    if(data.paypalAppId === null || typeof(data.paypalAppId) === "undefined") {
                        throw new Error("Paypal Access Token field is required");
                    }
                    if(data.paypalEnvironment === null || typeof(data.paypalEnvironment) === "undefined") {
                        throw new Error("Paypal Environment field is required");
                    }                                         
                }

                if (data.firebaseJson) {
                    const { stream, filename } = await data.firebaseJson;
                    let ext = filename.split(".")[1];
                    fileName = `firebaseJson_${new Date().getTime()}.${ext}`;
                    await storeUpload({ stream }, fileName, "firebaseJson", "firebase");
                    // data.firebaseJson = fileName;
                    // console.log("datdadasd", data)

                    if (admin.apps.length !== 0){
                            await admin.app().delete().then(async function() {
                                try {
                                    var serviceAccount = require(`../../fileStorage/uploads/firebase/firebaseJson/${fileName}`);
                                    admin.initializeApp({
                                        credential: admin.credential.cert(serviceAccount),    
                                    });
                                    data.firebaseJson = fileName;
                                }
                                catch(err) {      
                                    var siteDetails =  await site.findOne({});
                                    var serviceAccount = require(`../../fileStorage/uploads/firebase/firebaseJson/${siteDetails.firebaseJson}`);
                                    admin.initializeApp({
                                        credential: admin.credential.cert(serviceAccount),    
                                    });                              
                                    if (err.errorInfo) {
                                        throw new Error("Your firebase credentials are not valid, Upload a valid firebase JSON file");
                                    }                                    
                                }
                            });
                    } else {
                        var serviceAccount = require(`../../fileStorage/uploads/firebase/firebaseJson/${fileName}`);
                        try {
                            admin.initializeApp({
                                credential: admin.credential.cert(serviceAccount),    
                            });
                            data.firebaseJson = fileName;
                        }
                        catch(err) {
                            var siteDetails =  await site.findOne({});
                            var serviceAccount = require(`../../fileStorage/uploads/firebase/firebaseJson/${siteDetails.firebaseJson}`);
                            admin.initializeApp({
                                credential: admin.credential.cert(serviceAccount),    
                            });
                            if (err.errorInfo) {
                                throw new Error("Your firebase credentials are not valid, Upload a valid firebase JSON file");
                            }
                        }                            
                    }
                    // var found = await site.findOne()
                    // if(found.firebaseJson) {
                    // deleteImage(found.firebaseJson, "firebaseJson", "firebase");
                    // }
                }
                          
                const updated = await site.findOneAndUpdate({}, {$set: data}, {new: true}).then(function(data){
                    if (data) {
                        return true;
                    }
                });
                return updated;
            }
        }
    }
};

module.exports = resolvers;