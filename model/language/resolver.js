const {errors} = require("../../error");
const {AuthenticationError, UserInputError} = require("apollo-server");

const resolvers = {
    Query: {
        getLanguages: async(root, args, {currentUser, language}) => {
            const allLanguages =  await language.find({status: "Active"});         
            return allLanguages;
        },
        
        getAdminLanguages: async(root, args, {currentUser, language}) => {
            const allLanguages =  await language.find();        
            return allLanguages;
        }
    },

    Mutation: {        
        updateLanguage: async (root, {id, data}, params) => {
            let {currentUser, language} = params;
            if (currentUser.adminUserId) {
                var languageInfo;           
                if (id) {                                     
                    if (data.status === "Inactive" ) {
                        var languageData = await language.findOne({_id: id});                                                    
                        var loop = [params.category, params.featured, params.staticPages, params.reason, params.metatags];
                        for (var i=0; i<loop.length; i++) {
                            var dataValue = await loop[i].find();
                            dataValue.map((item) => {
                                item.language.map((a) => {
                                    if (a.langCode === languageData.value) {
                                        throw new UserInputError(`${loop[i].modelName} ${errors.cannotInactiveLanguage}`);
                                    }
                                });
                            });
                        }
                    }           
                    languageInfo = await language.findOneAndUpdate({_id: id}, {$set: data});
                }
                else {                    
                    languageInfo = await  new language(data).save();        
                }
                return languageInfo;
            } throw new AuthenticationError(errors.unauthorized);
        }
    }

};

module.exports = resolvers;