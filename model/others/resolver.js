
const {errors} = require("../../error");
const language = require("../../src/translations/api/lang.json");
const {AuthenticationError} = require("apollo-server");
const {date, storeUpload, mapConfig} = require("../../handler");
var { UserInputError } = require("apollo-server");
var braintree = require("braintree");
const resolvers = {
    Query: {

       
        getAdminCategoryDetails: async (root, {fetch}, {req, category,filterCategory, currentUser}) => {
            // if (!!req.headers.authorization && !currentUser.userId) {
            //     throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            // }
            // else {
                categoryInfo = await category.find();
                filterInfo = await filterCategory.find();
                categoryDetails = categoryInfo.map((item) => {  
                    IsMandatory = [];
                    filterIdData = [];
                    fieldData = item && item.fields && item.fields.map((i) => {
                        var specFilter = filterInfo.find((fI) => fI.id == i.filterId); 
                                fName = specFilter && specFilter.language.filter((f) => f.langCode === req.headers.lang);
                                if (fName && fName.length === 0){                        
                                    fName = specFilter.language.filter((f) => f.langCode === "en");
                                }
                                fieldInfo = {};
                                fName && fName.map( (v) => {                        
                                    fieldInfo.name = v.name;                                                
                                    // fieldInfo.values = v.values; 
                                    valuesData = v.values.map((vI) => {
                                        filtervaluesData = {};
                                        filtervaluesData.valueParentId = vI._id
                                        filtervaluesData.valueParent = vI.valueParent
                                        childData = vI.valueChild.map((j) => {
                                            childData = {};
                                            childData.valueChildId = j._id
                                            childData.valueChildData = j.valueChildData
                                            return childData;
                                        })
                                        filtervaluesData.valueChild = childData
                                        return filtervaluesData;
                                    })   
                                    fieldInfo.values = valuesData;                  
                                });  
                                if(specFilter && specFilter !== undefined){
                                    fieldInfo.filterId = i.filterId;
                                    fieldInfo.isMandatory = i.isMandatory;
                                    fieldInfo.inputTag = specFilter && specFilter.inputTag;
                                    fieldInfo.min = specFilter && specFilter.min;
                                    fieldInfo.max = specFilter && specFilter.max;
                                    filterIdData.push(i.filterId)
                                    if (i.isMandatory != null) {
                                        IsMandatory.push(i.isMandatory)
                                    }
                                }                              
                        return fieldInfo;                  
                    });

                    item = {
                        id: item.id,
                        language: item.language,                      
                        status: item.status,
                        isFeatured: item.isFeatured,
                        image : `${process.env.URL + req.headers.host}/fileStorage/uploads/category/${item.id}/${item.image}`,
                        fields : fieldData,
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt,
                        allIsMandatory: IsMandatory,
                        allFilterId: filterIdData
                    };
                    return item;     
                });               
                return categoryDetails;
            // }
        },

        getAdminCategorybyId: async (root, { id },{req, category}) => {
            var result = await category.findById(id);
            result.image = `${process.env.URL + req.headers.host}/fileStorage/uploads/category/${result.id}/${result.image}`;
            return result;
        },

        getCategoryDetails: async (root, {fetch}, params) => {
            let {req, currentUser, filterCategory, site, currency, chat, message, adBanner, category } = params;            
                var fName;

                // fetching category details               
                var categoryDetails = await category.find({status: "Active"}).sort("_id");;
                filterInfo = await filterCategory.find();

                let filteredCategoryInfo = categoryDetails.map( (item) => {
                    var categoryInfo = {};
                    categoryInfo.id = item._id,
                    categoryInfo.image = `${process.env.URL + req.headers.host}/fileStorage/uploads/category/${item.id}/${item.image}`,
                    categoryInfo.isFeatured = item.isFeatured,
                    categoryInfo.status = item.status,
                    categoryInfo.createdAt = item.createdAt,
                    categoryInfo.updatedAt = item.updatedAt;
                    
                    fName = item.language.filter((f) => f.langCode === req.headers.lang);
                    if (fName.length === 0){                        
                        fName = item.language.filter((f) => f.langCode === "en");
                    }
                      fName.map((i) => {                        
                        categoryInfo.name = i.name,
                        categoryInfo.description = i.description;
                    }); 

                    fieldData = item && item.fields && item.fields.map((i) => {
                        var specFilter = filterInfo.find((fI) => fI.id == i.filterId);  
                                specFilterName = specFilter.language.filter((f) => f.langCode === req.headers.lang);
                                if (specFilterName.length === 0){                        
                                    specFilterName = specFilter.language.filter((f) => f.langCode === "en");
                                }
                                fieldInfo = {};
                                specFilterName.map( (v) => {   
                                    fieldInfo.name = v.name;                                                
                                    valuesData = v.values.map((vI) => {
                                        filtervaluesData = {};
                                        filtervaluesData.valueParentId = vI._id
                                        filtervaluesData.valueParent = vI.valueParent
                                        childData = vI.valueChild.map((j) => {
                                            childData = {};
                                            childData.valueChildId = j._id
                                            childData.valueChildData = j.valueChildData
                                            return childData;
                                        })
                                        filtervaluesData.valueChild = childData
                                        return filtervaluesData;
                                    })   
                                    fieldInfo.values = valuesData;
                                });
                        fieldInfo.filterId = i.filterId;
                        fieldInfo.isMandatory = i.isMandatory;
                        fieldInfo.inputTag = specFilter.inputTag;
                        fieldInfo.min = specFilter.min;
                        fieldInfo.max = specFilter.max;
                        return fieldInfo;
                    });  
                    categoryInfo.fields = fieldData;      
                    return categoryInfo;
                });                                 

                // fetching frequency details               
                var Frequency = [
                    "Hourly", "Daily", "Weekly", "Biweekly", "Monthly", "Yearly", "One-time"
                ];                

                // fetching currency details               
                var siteSetting = await site.findOne({}, "defaultCurrency");
                var getDefault = site && await currency.findOne({code: siteSetting.defaultCurrency}, "code symbol");
                var defaultCurrencyCode = getDefault && getDefault.code;
                var defaultCurrencySymbol = getDefault && getDefault.symbol;

                // fetching unread message count details               
                if (currentUser.userId ) {
                    var chatResult1 = await chat.find({productuserId: currentUser.userId});
                    var chatResult2 = await chat.find({userId: currentUser.userId});          
                    var chatResult = chatResult1.concat(chatResult2);
                    var chatMsg = chatResult.map( (item) => {
                        return item._id;
                    });                     
                        var msg = await message.find({room: chatMsg});                        
                        var rM = msg.filter((a) => a.userId != currentUser.userId);

                        var readMessage = rM.map( (item) => {
                            return item.readMessage;
                        });
                        var filtered = readMessage.filter(function (el) {
                            return el == false ;
                        });                    
                        var unreadMessage = filtered.length;                    
                    } else {
                        unreadMessage = 0;
                }

                // fetching adBannerDetails details               
                var adBannerDetails = await adBanner.find({status: "Active"});                  
                adBannerDetails.forEach(function(res) {
                    res.webBannerImage = `${process.env.URL + req.headers.host}/fileStorage/uploads/webBanner/${res.id}/${res.webBannerImage}`;              
                    res.mobileBannerImage = `${process.env.URL + req.headers.host}/fileStorage/uploads/mobileBanner/${res.id}/${res.mobileBannerImage}`;
                });
                adBannerDetails = adBannerDetails;

                // result for all
                var result = {
                    category : filteredCategoryInfo,                    
                    frequency: Frequency,                    
                    adBannerDetails: adBannerDetails,
                    currencyCode: defaultCurrencyCode,
                    currencySymbol: defaultCurrencySymbol,
                    unreadMessage: unreadMessage
                };
                return result;
        },

        // get all currencies info like currencycode, symbol, rate,..
        
        getCurrencies: async (root, {fetch}, {currentUser, currency}) => {
                const currencies = fetch === "all" ? 
                await currency.find({}).sort("-default")
                : await currency.find({status: "Active"}).sort("-default");
                return currencies;
        },
        // get specific currency details like currencycode, symbol, rate,.. by id
        getCurrency: async (root, {id}, {currentUser, currency}) => {
            if (currentUser.adminUserId) {
                const foundCurrency = await currency.findOne({_id: id});
                return foundCurrency;
            } else {
                throw new AuthenticationError(errors.unauthorized);
            }
        },
        // get all countries info
        getCountries: async (root, args, {currentUser, country}) => {
                const countries = await country.find({}, "name");
                return countries;
        },
        // get all timezone informations
        getTimezone: async (root, args, {currentUser, timezone}) => {
                const timeZone = await timezone.find({}, "name");
                return timeZone;
        },

        // get all featured informations
        getFeaturedDetails: async (root, args, {req, currentUser, featured, currency,site}) => {
            var featuredDetails = await featured.find({status: "Active"}).sort("createdAt");    
            const currencies = await currency.find({}, "code symbol rate");
            var chosenCurrency = await currency.findOne({code: req.headers.currency});
            var USDCurrency = await currency.findOne({code: "USD"});
            var siteSetting = await site.findOne({});
            var paymentInfoData = [];
          
                let filteredFeatured = featuredDetails.map( (item) => {
                    var featuredInfo = {};
                    featuredInfo.id = item._id,                   
                    featuredInfo.validationPeriod = item.validationPeriod,             
                    featuredInfo.status = item.status,
                    featuredInfo.createdAt = item.createdAt,
                    featuredInfo.updatedAt = item.updatedAt;
                    
                    var fName = item.language.filter((f) => f.langCode === req.headers.lang);
                    if (fName.length === 0){                        
                        fName = item.language.filter((f) => f.langCode === "en");
                    }
                      fName.map((i) => {                        
                        featuredInfo.name = i.name,
                        featuredInfo.description = i.description;        
                    });     

                    if(item.image) {
                        featuredInfo.image = `${process.env.URL + req.headers.host}/fileStorage/uploads/featured/${item.id}/${item.image}`;
                    }
    
                   
                    var featuredCurrentRate = currencies.find((c) => c.code == item.currencyCode);   
                    var featuredConversionRate = (item.price / featuredCurrentRate.rate).toFixed(2);                   

                    if (item.currencyCode !== "USD"){                     
                        featuredInfo.price = featuredConversionRate;
                        featuredInfo.currencyCode = "USD";
                        featuredInfo.currencySymbol = USDCurrency.symbol;
                    } else {
                        featuredInfo.price = item.price;
                        featuredInfo.currencyCode = "USD";
                        featuredInfo.currencySymbol = USDCurrency.symbol;
                    }
                    
                    if (item.currencyCode !== req.headers.currency) {                      
                        var msg = (featuredConversionRate * chosenCurrency.rate).toFixed(2);  
                        featuredInfo.beforeconversionMsg = `${msg}`;
                        featuredInfo.afterconversionMsg = `${featuredInfo.price}`;
                    } else {
                        featuredInfo.beforeconversionMsg = `${item.price}`;
                        featuredInfo.afterconversionMsg = `${featuredInfo.price}`;
                    }
                 
                    return featuredInfo;
                });
                 
                if(siteSetting.stripe){
                    let stripePayData = {
                        payment_type: "Stripe",
                        value:"Stripe",
                        icon: `${process.env.URL + req.headers.host}/fileStorage/uploads/featured/paymentIcons/stripe.png`,
                        key:siteSetting.stripePublishKey,
                        mode:""
                    }
                    paymentInfoData.push(stripePayData)
                }
                if(siteSetting.paypal){
                    try{
                        var gateway = braintree.connect({
                            accessToken: siteSetting.paypalAppId
                        });
                        let res = await gateway.clientToken.generate({});
                        let paypalPayData = {
                            payment_type:"Paypal",
                            value :"Paypal",
                            icon: `${process.env.URL + req.headers.host}/fileStorage/uploads/featured/paymentIcons/paypal.png`,
                            key: res.clientToken,
                            mode : ""
                        }
                        paymentInfoData.push(paypalPayData)
                    }
                    catch(error){
                        if(error){
                            let paypalPayData = {
                                payment_type:"Paypal",
                                value :"Paypal",
                                icon: `${process.env.URL + req.headers.host}/fileStorage/uploads/featured/paymentIcons/paypal.png`,
                                key: "",
                                mode : ""
                            }
                            paymentInfoData.push(paypalPayData)
                        }
                    }    
                }
                if(siteSetting.braintree){
                    let braintreePayData = {
                        payment_type:"Braintree",
                        value :"Braintree",
                        icon: `${process.env.URL + req.headers.host}/fileStorage/uploads/featured/paymentIcons/braintree.jpg`,
                        key:"",
                        mode :""
                    }
                    paymentInfoData.push(braintreePayData)
                }

                var returnData = {
                    paymentInfo: paymentInfoData,
                    featuredInfo: filteredFeatured
                }
                 return returnData;

        },

        getAdminFeaturedDetails: async (root, args, {req, currentUser, featured, currency}) => {
            var featuredDetails = await featured.find({}).sort("createdAt");                                
            featuredDetails.forEach(function(res) {
                if(res.image) {
                    res.image = `${process.env.URL + req.headers.host}/fileStorage/uploads/featured/${res.id}/${res.image}`;
                }
            });
            return featuredDetails;                        
        },                                        

        // getReportOptions: async(root, args, {currentUser, report, req}) => {
        //     if (currentUser) {
        //         const reportList = await report.find({});
        //         if (reportList && reportList.length) {
        //             reportList.forEach((rl) => {
        //                 rl.imageUrl = rl.imageUrl && URL + req.headers.host + "/fileStorage/uploads/report/" + rl.id +"/" + rl.imageUrl;
        //             });
        //         } 
        //         return reportList;
        //     }
        // }
    },
    Mutation: {
        //api to update informations of categories
        updateCategory: async (root, {id, data}, params) => {
            let {currentUser, product, category} = params;
            if(currentUser.adminUserId) {
                    if (id) {                                                
                        var categoryData = await category.find({isFeatured: true});
                        if (categoryData.length === 1) {                                    
                            if (categoryData[0]._id === id) {
                                if(data.isFeatured == false) {
                                    throw new UserInputError(`${errors.cannotIsfeaturedFalse}`);
                                }
                            }
                        }                        
                        if (data.status === "Inactive") {
                            var productData = await product.find({categoryId: id});
                            if(productData.length !== 0) {                                     
                                throw new UserInputError(`Category ${errors.cannotInactive} category`);                             
                            }                                                                                       
                        }  

                        var productData = await product.find({categoryId: id});
                        if(productData.length) {                                     
                            throw new UserInputError(`Category ${errors.cannotEdit} category`);                             
                        }

                        if (data.allFilterId) {
                            var filterIdInput = data.allFilterId
                            delete data.allFilterId
                        }
                        if (data.allIsMandatory) {
                            var isMandatoryInput = data.allIsMandatory
                            delete data.allIsMandatory
                        }
                        if (filterIdInput) {
                            data.fields = [];
                            filterIdInput.map((i) => {
                                fieldsData = {};
                                if (isMandatoryInput) {
                                    isMandatoryInput.map((j) => {
                                        if(i === j){                                                                                    
                                            fieldsData.isMandatory = j;
                                        }                                    
                                    }) 
                                }                                   
                                fieldsData.filterId = i;                                                           
                                data.fields.push(fieldsData)
                            })
                        }                                       
                        if (data.image) {
                            const { stream, filename } = await data.image;
                            let ext = filename.split(".")[1];
                            var fileName = `category_${new Date().getTime()}.${ext}`;
                            await storeUpload({ stream }, fileName, String(id), "category");
                            data.image = fileName;
                        }                        
                        data.updatedAt = date();     
                        const updated = await category.findOneAndUpdate({_id: id}, {$set: data}, {new: true}).then(function(data){
                            if (data) {
                                return true;
                            }
                            return false;
                        });
                        return updated;                               
                    } 
                    else {
                        var image = data.image;
                        delete data.image;
                        if (data.allFilterId) {
                            var filterIdInput = data.allFilterId
                            delete data.allFilterId
                        }
                        if (data.allIsMandatory) {
                            var isMandatoryInput = data.allIsMandatory
                            delete data.allIsMandatory
                        }                                               
                        const resultInfo = await new category(data).save();
                        if (filterIdInput) {
                            fields = [];
                            filterIdInput.map((i) => {
                                fieldsData = {};
                                if (isMandatoryInput) {
                                    isMandatoryInput.map((j) => {
                                        if(i === j){                                                                                    
                                            fieldsData.isMandatory = j;
                                        }                                    
                                    }) 
                                }                                   
                                fieldsData.filterId = i;                                                           
                                fields.push(fieldsData)
                            })
                        }   
                        if (image) {
                            const { stream, filename } = await image;
                              let ext = filename.split(".")[1];
                            fileName = `category_${new Date().getTime()}.${ext}`;
                            await storeUpload({ stream }, fileName, String(resultInfo._id), "category");
                            image = fileName;
                        }
                        const updated = await category.findOneAndUpdate({_id: resultInfo._id}, {$set: {image: image, fields: fields}}, {new: true}).then(function(data){
                            if (data) {
                                return true;
                            }
                            return false;
                        });
                        return updated;
                    }
            }
            else {
                throw new AuthenticationError(errors.unauthorized);
            }
        },

        // api to update currency informations
        updateCurrency: async (root, {id, data}, {currentUser, currency, product, site}) => {
            if (currentUser.adminUserId) {
                var currencyInfo;
                if (id) {         
                    if (data.status === "Inactive") {
                        var defaultData = await site.findOne({}, "defaultCurrency");
                        var currencyData = await currency.findOne({code: defaultData.defaultCurrency});
                        var currencyDetail = await currency.findOne({_id: id});
                        if (currencyData._id == id){
                            throw new UserInputError(`Currency is ${errors.cannotEditDefault} currency. So you can't inactive this currency`);
                        }
                        else {
                            productData = await product.find({currencyCode: currencyDetail.code});
                            if(productData.length !== 0) {                                     
                                throw new UserInputError(`Currency ${errors.cannotInactive} currency`);                             
                            }
                        }
                    }
                    currencyInfo = await currency.findOneAndUpdate({_id: id}, {$set: data}, {new: true})
                    .then(function(data) { if (data) {
                        return true; 
                    }
                    });
                }

                else {
                currencyInfo = await  new currency(data).save()
                .then((data) => { if (data) {
                    return true; 
                }
                });
                }
                return currencyInfo;
            }
        },

        // update featured list
        updateFeatured: async (root, {id, data}, {currentUser, featured, currency, product}) => {
            if (currentUser.adminUserId) {
                if(data.currencyCode) {
                    var currencyInfo = await currency.findOne({code: data.currencyCode});
                }
                var featuredInfo;
                if (id) {
                    if(data.currencyCode) {
                        data.currencySymbol = currencyInfo.symbol;
                    }
                    if (data.image) {
                        const { stream, filename } = await data.image;
                          let ext = filename.split(".")[1];
                        var fileName = `featured_${new Date().getTime()}.${ext}`;
                        await storeUpload({ stream }, fileName, String(id), "featured");
                        data.image = fileName;
                    }
                    if (data.status === "Inactive") {                                          
                        var productData = await product.find({featured: id});
                        if(productData.length !== 0) {                                     
                            throw new UserInputError(`Featured ${errors.cannotInactive} featured`);                             
                        }
                    }
                    featuredInfo = await featured.findOneAndUpdate({_id: id}, {$set: data});
                }else{
                    data.currencySymbol = currencyInfo.symbol;
                    var image = data.image;
                    delete data.image;
                    var featuredData = await  new featured(data).save();
                    if (image) {
                        const { stream, filename } = await image;
                          let ext = filename.split(".")[1];
                        fileName = `featured_${new Date().getTime()}.${ext}`;
                        await storeUpload({ stream }, fileName, String(featuredData._id), "featured");
                        data.image = fileName;
                    }
                     var featuredInfo = await featured.findOneAndUpdate({_id: featuredData._id}, {$set: {image: data.image}});
                }
                return featuredInfo;
            } else {
                throw new AuthenticationError(errors.unauthorized);
            }
        }        
    }
};

module.exports = resolvers;