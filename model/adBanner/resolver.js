
const {errors} = require("../../error");
const language = require("../../src/translations/api/lang.json");
const {AuthenticationError} = require("apollo-server");
const {date, storeUpload, mapConfig} = require("../../handler");

const resolvers = {
    Query: {

        // get all ad Banner informations
        getAdBannerInfo: async (root, args, {req, adBanner}) => {
            var adBannerDetails = await adBanner.find({});                               
            adBannerDetails.forEach(function(res) {
                    res.webBannerImage = `${process.env.URL + req.headers.host}/fileStorage/uploads/webBanner/${res.id}/${res.webBannerImage}`;              
                    res.mobileBannerImage = `${process.env.URL + req.headers.host}/fileStorage/uploads/mobileBanner/${res.id}/${res.mobileBannerImage}`;
            });
            return adBannerDetails;        
        },
        
    },
    Mutation: {        
        // update ad Banner list
        updateAdBanner: async (root, {id, data}, {currentUser, adBanner, req}) => {
            if (currentUser.adminUserId) {
                var adBannerInfo;
                if (id) {  
                    var fileName;
                    if (data.webBannerImage) {
                        const { stream, filename } = await data.webBannerImage;
                          let ext = filename.split(".")[1];
                        fileName = `webBanner_${new Date().getTime()}.${ext}`;
                        await storeUpload({ stream }, fileName, String(id), "webBanner");
                        data.webBannerImage = fileName;
                    }
                    if (data.mobileBannerImage) {
                        const { stream, filename } = await data.mobileBannerImage;
                          let ext = filename.split(".")[1];
                        fileName = `mobileBanner_${new Date().getTime()}.${ext}`;
                        await storeUpload({ stream }, fileName, String(id), "mobileBanner");
                        data.mobileBannerImage = fileName;
                    }
                    adBannerInfo = await adBanner.findOneAndUpdate({_id: id}, {$set: data});
                } else {
                    var webBannerImage = data.webBannerImage;
                    delete data.webBannerImage;
                    var mobileBannerImage = data.mobileBannerImage;
                    delete data.mobileBannerImage;
                    var adBannerData = await  new adBanner(data).save();
                    if (webBannerImage) {
                        const { stream, filename } = await webBannerImage;
                          let ext = filename.split(".")[1];
                        fileName = `webBanner_${new Date().getTime()}.${ext}`;
                        await storeUpload({ stream }, fileName, String(adBannerData._id), "webBanner");
                        data.webBannerImage = fileName;
                    }
                    if (mobileBannerImage) {
                        const { stream, filename } = await mobileBannerImage;
                          let ext = filename.split(".")[1];
                        fileName = `mobileBanner_${new Date().getTime()}.${ext}`;
                        await storeUpload({ stream }, fileName, String(adBannerData._id), "mobileBanner");
                        data.mobileBannerImage = fileName;
                    }
                    adBannerInfo = await adBanner.findOneAndUpdate({_id: adBannerData._id}, {$set: {webBannerImage: data.webBannerImage, mobileBannerImage: data.mobileBannerImage } } );
                }
                return adBannerInfo;
            } throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
        }       
    }
};

module.exports = resolvers;