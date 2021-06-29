const {errors} = require("../../error");
const language = require("../../src/translations/api/lang.json");
const {AuthenticationError} = require("apollo-server");

const resolvers = {
    Query: {
        
        getstaticPageDetails: async (root, args, params) => {
            let {req, currentUser, staticPages} = params;
            if (!!req.headers.authorization && !currentUser.userId) {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
            else { 
                // fetching Static Pages details               
                var staticPagesDetails = await staticPages.find();
                var fName;
                let result = staticPagesDetails.map( (item) => {
                    var staticPagesInfo = {};
                    staticPagesInfo.id = item._id,
                    staticPagesInfo.url = `/pages/${item.url}`,
                    staticPagesInfo.status = item.status,
                    staticPagesInfo.createdAt = item.createdAt,
                    staticPagesInfo.updatedAt = item.updatedAt;
                    
                    fName = item.language.filter((f) => f.langCode === req.headers.lang);
                    if (fName.length === 0) {                        
                        fName = item.language.filter((f) => f.langCode === "en");
                    }
                    else {
                        fName = item.language.filter((f) => f.langCode === req.headers.lang);
                    }
                    fName.map((i) => { 
                        staticPagesInfo.title = i.title,
                        staticPagesInfo.content = i.content;                      
                    });                                             
                    return staticPagesInfo;
                });                                      
                return result;
            }
        },

        getAdminStaticPageDetails: async (root, args, params) => {
            let {req, currentUser, staticPages} = params;
            if (!!req.headers.authorization && !currentUser.userId) {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
            else { 
                // fetching admin Static Pages details               
                var adminStaticPagesDetails = await staticPages.find();                
                return adminStaticPagesDetails;               
            }
        }
    },

    Mutation: {        
        updateStaticPages: async (root, {id, data}, {currentUser, staticPages}) => {
            if (currentUser.adminUserId) {  
                var changedUrl; 
                var staticPagesInfo;      
                if (id) {                          
                    changedUrl = data.language.filter((f) => f.langCode === "en");                    
                        changedUrl.map((i) => {                        
                        data.url = i.title.toLowerCase().replace(/ /g, "_");            
                        });
                    staticPagesInfo = await staticPages.findOneAndUpdate({_id: id}, {$set: data});
                }
                else {                    
                    changedUrl = data.language.filter((f) => f.langCode === "en");                
                      changedUrl.map((i) => {                        
                        data.url = i.title.toLowerCase().replace(/ /g, "_");                     
                    }); 
                    staticPagesInfo = await new staticPages(data).save();
                }
                return staticPagesInfo;
            } 
            else {
                throw new AuthenticationError(errors.unauthorized);
            }
        }
    }
};

module.exports = resolvers;