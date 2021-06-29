
const {errors} = require("../../error");
const {AuthenticationError, UserInputError} = require("apollo-server");

const resolvers = {
    Query: {

        // get all filters informations
        getFilters: async (root, {fetch}, {req, filterCategory}) => {

            const filterDetails = await filterCategory.find({status: "Active"})
            filterDetails.map((item) => {     
                    fName = item.language.filter((f) => f.langCode === req.headers.lang);
                    if (fName.length === 0){                        
                        fName = item.language.filter((f) => f.langCode === "en");
                    }
                    fName.map( (i) => {                        
                        item.name = i.name;                                                
                        values = i.values.map((a) => {
                            values = {};
                            values.valueParent = a.valueParent
                            values.valueChild = a.valueChild.map((l) => {
                                return l.valueChildData
                            })
                            // values.valueChild = values.valueChild.join()
                        return values
                        }) 
                        item.values = values;   
                })
                return item;     
            });    
            return filterDetails;                         
        },

        getAdminFilter: async (root, args, {req, filterCategory}) => {
            const filterData = await filterCategory.find()
            adminFilters = filterData.map((i) => {
                adminFiltersInfo = {};
                adminFiltersInfo.id = i.id
                adminFiltersInfo.min = i.min
                adminFiltersInfo.max = i.max
                adminFiltersInfo.inputTag = i.inputTag
                adminFiltersInfo.status = i.status
                adminFiltersInfo.createdAt = i.createdAt
                adminFiltersInfo.updatedAt = i.updatedAt
                adminFiltersInfo.language = i.language.map((j) => {
                    language = {};
                    language.langCode = j.langCode;
                    language.name = j.name
                    language.values = j.values.map((k) => {
                        values = {};
                        values.valueParent = k.valueParent
                        values.valueChild = k.valueChild.map((l) => {
                            return l.valueChildData
                        })
                        return values
                    })
                    return language
                })
                return adminFiltersInfo
            })            
            return adminFilters;                         
        }
        
    },
    Mutation: {        
        updateFilter: async (root, {id, data}, {filterCategory, product, category, currentUser}) => {
            if (currentUser.adminUserId) {                
                if (id) {
                    var categoryFieldData = await category.find({"fields.filterId": id});
                    if(categoryFieldData.length > 0){
                        throw new UserInputError(`Filter ${errors.categoryEdit} filter`);    
                    }
                    // var productData = await product.find({"categoryFields.fieldId": id.toString()});
                    // if(productData.length) {                                     
                    //     throw new UserInputError(`Filter ${errors.cannotEdit} filter`);                             
                    // }
                    if (data.status === "Inactive") {
                        var categoryData = await category.find({"fields.filterId": id});
                        if(categoryData.length !== 0) {                                     
                            throw new UserInputError(`Filter ${errors.cannotInactiveFilter} filter`);                             
                        }                                                                                       
                    }
                    
                    filterInfo = {};
                    filterInfo.language = data.language.map((i) => {
                        languageData = {};
                        languageData.langCode = i.langCode
                        languageData.name = i.name
                        if(data.inputTag == "range") {
                            languageData.values = [];
                        }
                        else {
                            languageData.values = i.values && i.values.map((j) => {
                                values = {};
                                values.valueParent = j.valueParent
                                values.valueChild = j.valueChild.map((vC) => {
                                    valueChildData = {};
                                    valueChildData.valueChildData = vC;
                                    return valueChildData
                                })
                                    return values;
                            })
                        }
                        return languageData;
                    })
                    // FOR DROPDOWN RESTRICTION
                    // if(data.language.length > 1) {
                    //     // console.log("aaaaaa")
                    //     for(i=0; i<data.language.length; i++){
                    //         // data.language.map((j) => {
                    //             if(data.language[i].values.length > 0) {
                    //                 for(j = 0; j <  data.language[i].values.length; j++){
                    //                     var valueChildLength;
                    //                     if(i == 0){
                    //                         console.log("iiiiiii" ,i)
                    //                         valueChildLength = data.language[i].values[j].valueChild.length
                    //                     }
                    //                     else{
                    //                         // console.log(valueChildLength)
                    //                         console.log(valueChildLength, data.language[i].values[j].valueChild.length )
                    //                         if(valueChildLength !== data.language[i].values[j].valueChild.length){
                    //                             throw new UserInputError(`value child length is not matched`);                             
                    //                         }
                    //                     }
                    //                 }
                    //             }
                                
                    //             // data.language[i].values && data.language[i].values.map((k) => { 
                                    
                    //             // })
                    //         // })
                    //     }
                    // }

                    // FOR LENGTH RESTRICTION
                    if(data.language.length > 1) {
                        // for(i=0; i<data.language.length; i++){
                            data.language.map((i) => {
                                if(i.values.length > 0) {
                                    for(j = 0; j <  i.values.length; j++){
                                        for(k=0; k<data.language.length; k++) {
                                            var valueChildLength;
                                            if(k == 0 && data.language[k].values[j] != undefined){
                                                valueChildLength = data.language[k].values[j].valueChild.length
                                            }
                                            else {
                                                if(data.language[k].values[j] == undefined ){
                                                    throw new UserInputError(`Values length Must be same for all selected languages`);                             
                                                }
                                                if(data.language[k].values[j] != undefined && valueChildLength !== data.language[k].values[j].valueChild.length){
                                                    throw new UserInputError(`Please check the Value child Fields. Value child length is not Matched`);                             
                                                }
                                            }
                                        }
                                    }
                                }                                                                    
                            })
                        // }
                    }
                    //
                    if (data.min >=0 && data.max >=0) {
                        filterInfo.min = data.min;                    
                        filterInfo.max = data.max;  
                    }                   
                    filterInfo.inputTag = data.inputTag;
                    filterInfo.status = data.status;
                    await filterCategory.deleteOne({ _id : id })
                    filterInfo = await new filterCategory(filterInfo).save();
                }
                else {        
                    filterInfo = {};
                    filterInfo.language = data.language.map((i) => {
                        languageData = {};
                        languageData.langCode = i.langCode
                        languageData.name = i.name
                        if(data.inputTag == "range"){
                            languageData.values = [];
                        }
                        else {
                            languageData.values = i.values && i.values.map((j) => {
                                values = {};
                                values.valueParent = j.valueParent
                                values.valueChild = j.valueChild.map((vC) => {
                                    valueChildData = {};
                                    valueChildData.valueChildData = vC;
                                    return valueChildData
                                })
                                    return values;
                            })
                        }
                        return languageData;
                    })

                    // FOR LENGTH RESTRICTION
                    if(data.language.length > 1) {
                        data.language.map((i) => {
                            if(i.values.length > 0) {
                                for(j = 0; j <  i.values.length; j++){
                                    for(k=0; k<data.language.length; k++) {
                                        var valueChildLength;
                                        if (k == 0 && data.language[k].values[j] != undefined){
                                            valueChildLength = data.language[k].values[j].valueChild.length
                                        }
                                        else {
                                            if(data.language[k].values[j] == undefined ){
                                                throw new UserInputError(`Values length Must be same for all selected languages`);                             
                                            }
                                            if(data.language[k].values[j] != undefined && valueChildLength !== data.language[k].values[j].valueChild.length){
                                                throw new UserInputError(`Please check the Value child Fields. Value child length is not Matched`);                             
                                            }
                                        }
                                    }
                                }
                            }                                
                        })
                    }
                    //
                    if (data.min >=0 && data.max >= 0) {
                        filterInfo.min = data.min;                    
                        filterInfo.max = data.max;                    
                    }
                    filterInfo.inputTag = data.inputTag;
                    filterInfo.status = data.status;                    
                    filterInfo = await  new filterCategory(filterInfo).save();                  
                }
                return filterInfo;
            } else {
                throw new AuthenticationError(errors.unauthorized);
            }
        }
    }
};

module.exports = resolvers;

