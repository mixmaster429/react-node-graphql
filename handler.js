const jwt = require("jsonwebtoken");
const path = require("path");
const Base64 = /^data:([A-Za-z-+\/]+);base64,(.+)$/;
const { errors } = require("./error");
const language = require("./src/translations/api/lang.json");
var nodemailer = require("nodemailer");
var async = require("async");
var fs = require("fs");
var crypto = require("crypto");
const { blackList, user } = require("./dbSchema");
var { ForbiddenError, AuthenticationError } = require("apollo-server");
const {URL, Site_Url, env, REACT_APP_Domain_Url} = process.env;
const sendMailAction = require("./mailtemp");
const config = require("./config.json");
const uuidv4 = require("uuid/v4");
var paginate = 20;


const getClientSecret = (appleClientId,appleKeyIdentifier,appleTeamId,appleP8File) => {
  const privateKey = fs.readFileSync(`fileStorage/uploads/appleAuth/authp8File/${appleP8File}`);
  const headers = {
        alg: "ES256",
        kid: appleKeyIdentifier
    }
    const timeNow = Math.floor(Date.now() / 1000);
    const claims = {
          "iss": appleTeamId,
          "iat": timeNow,
          "exp": timeNow + 15777000,
          "aud": "https://appleid.apple.com",
          "sub": appleClientId,
    }

  var token = jwt.sign(claims, privateKey, {
    algorithm: "ES256",
    header: headers,
    //expiresIn: "24h"
  });
  return token;
  
}

const getUserId = (token) => {
	const parts = token.split(".");
	try {
        //console.log("inside getUser",JSON.parse(new Buffer(parts[1], "base64").toString("ascii")))
		return JSON.parse(new Buffer(parts[1], "base64").toString("ascii"));
	} catch (e) {
		return null;
	}
}


  // JWT Middleware
  const getUser = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization;
    if (!!token && token !== "undefined") {
      var foundBlackList = await blackList.findOne({token: token});
      if (foundBlackList) {
        req.user = null;
      } else {
        req.user = await jwt.verify(token, process.env.JWT_SECRET);
        if (req.user) {
          var found = await user.findOne({_id: req.user.userId});
          if (!found) {
            req.user = null;
          }
          else if (found.status === "Inactive") {
            req.user = null;
          }
        }
      }
    } else {
      req.user = null;
    }
    next();
  };
  var session = require("express-session");
  var MemoryStore = require("session-memory-store")(session);
  // config for SESSION middleware
  const options = {
    name: "access_token",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore(),
    cookie: {
      httpOnly: true,
      path: "/",
      //maxAge: new Date(Date.now() + (30 * 86400 * 1000)),
      secure: false
    }
  };

  // create JWT token with current user informations.
  const createToken = (user, secret, expiresIn) => {
    const { userName, email, id} = user;
    return jwt.sign({userName, email, userId: id}, secret, {expiresIn});
  };

  // reusable function to get result in user signin/signup
  const findUser = async function(found, loginType, {headers, site, currency}) {
    var {host, channel, lang} = headers;
    if(!found) {
      throw new ForbiddenError(typeof(language[lang]) !== "undefined" ? language[lang]._usernotFound : language.en._usernotFound);
    }
    var getDefault = await site.findOne({}, "defaultCurrency");
    const currecy = getDefault && await currency.findOne({code: getDefault.defaultCurrency}, "code symbol");
    let result = {
        userId: found.id,
        userName : found.userName,
        profileImage : found.profileImage ? 
        loginType === "signin" ? `${process.env.URL+host}/fileStorage/uploads/users/${String(found._id)}/${found.profileImage}` :
        (found.profileImage.indexOf("graph.facebook.com") >=0 || found.profileImage.indexOf("googleusercontent.com") >=0) ? 
        found.profileImage : `${process.env.URL+host}/fileStorage/uploads/users/${String(found._id)}/${found.profileImage}` : `${process.env.URL+host}/fileStorage/static/default.png`,
        currencyCode: currecy ? currecy.code : "",
        currencySymbol: currecy ? currecy.symbol : "",
        token : !!(channel === "mobile")
         ? createToken(found, process.env.JWT_SECRET, "1yr")
         : "",
        location: found.location
    };
    return {result};
  }
  
  // social login reusable function
  const socialLogin = async function (user, data, loginType, {req, site, currency}) {
    var foundUser = await user.findOne(loginType);
    if (foundUser) {
      if (foundUser.status !== "Active") {
        throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._inActive : language.en._inActive);
      }
      if (req.session && !req.headers.channel) {
        req.session.userId = foundUser.id;
        req.session.role = foundUser.role;
        req.session.userName = foundUser.userName;
    }
      return findUser(foundUser, "", {headers: req.headers, site, currency});
    } else {
        if (data.email) {
            var foundAgain = await user.findOne({email: data.email});
            if (foundAgain) {
              let key = Object.keys(loginType)[0];
              if (foundAgain.status !== "Active") {
                throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._inActive : language.en._inActive);
              } else if (!foundAgain[key]) {
                let pImage = foundAgain.profileImage ? foundAgain.profileImage : data.profileImage;
                var toInsert = {};
                toInsert[key] = data[key];
                toInsert.profileImage = pImage;
                const updateInfo = await user.findOneAndUpdate({_id: foundAgain._id}, {$set: toInsert}, {new: true});
                if (req.session && !req.headers.channel) {
                  req.session.userId = foundAgain.id;
                  req.session.role = foundAgain.role;
                  req.session.userName = foundAgain.userName;
              }
                return findUser(updateInfo, "", {headers: req.headers, site, currency});
              } else {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._emailExists : language.en._emailExists);
              }
            } else if (!foundAgain) {
              var newUser = await new user(data).save();
              //await user.findOneAndUpdate({_id: newUser._id});
              if (req.session && !req.headers.channel) {
                req.session.userId = newUser.id;
                req.session.role = newUser.role;
                req.session.userName = newUser.userName;
            }
              return findUser(newUser, "", {headers: req.headers, site, currency});
            }
        } else {
            return {noEmail: true};
        }
    }
}

  //to get customized time values
  const dateAdd = function (date, type) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return type === "short" ? interval + "y" : interval + " years ago";
    }
  
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return type === "short" ? interval + "m" : interval + " months ago";
    }
  
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return type === "short" ? interval + "d" : interval + " days ago";
    }
  
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return type === "short" ? interval + "h" : interval + " hours ago";
    }
  
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return type === "short" ? interval + "min" : interval + " minutes ago";
    }
  
    return type === "short" ? "0min" : Math.floor(seconds) + " seconds ago";
  }


// date function
const date = () => {
  return Date().toString();
};

// to check given string is Base64
const isBase64 = function(str) {
  const len = str.length;
  if (!len || !Base64.test(str)) {
    return false;
  }
  const firstPaddingChar = str.indexOf("=");
  return firstPaddingChar === -1 ||
    firstPaddingChar === len - 1 ||
    (firstPaddingChar === len - 2 && str[len - 1] === "=");
}

//image upload reusable function
const imageUpload = (data, id, type) => {
  if (data.includes("jpeg"||"jpg") || data.includes("png")) {
    //if(data){
    var ext = data.split(";")[0].match(/jpeg|jpg|png/)[0];
    var image = data.replace(/^data:image\/\w+;base64,/, "");
    var imageName = "user" + Date.now() + "." + ext;

    const imagePath = path.join("fileStorage", "uploads", type, String(id));
    if(!fs.existsSync(imagePath)) {
      fs.mkdirSync(imagePath);
    }
    fs.writeFile(
      path.join(imagePath, imageName),
        image,
        "base64",
        function(err) {
           //console.log(err);
        });
        return imageName;
  } else {
    throw new ForbiddenError("Invalid file type. Images must be in PNG or JPG format and under 5mb ");
  }
};

//reusable function to delete images
const deleteImage = (data, id, type) => {
  const imagePath = path.join("fileStorage", "uploads", type, String(id), data);
  if(fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
    return true;
  }
};

// reusable function to get products from DB 
const updateFetchedProducts = async (pageNumber, filters, filter, data, approvedSellingProducts, type) => {
  
  let {user, currency, req, currentUser, chat, category, filterCategory, bUser, product, featured, transaction, site} = data;
  
  const users = await user.find({}, "profileImage userName");
  var categories = await category.find({});
  const currencies = await currency.find({}, "code symbol rate");
  var chosenCurrency = await currency.findOne({code: req.headers.currency});
  // var approvedSellingProducts = await product.find(filters);
  var products = approvedSellingProducts;
  var featuredDetails = await featured.find({});
  var filterData = await filterCategory.find({});
  // var sitedefaultCurrency = await site.findOne()
  // var transactionDetails = await transaction.find({})

  if (currentUser.userId) {
    var groups = await chat.find({userId: currentUser.userId});
    var blockedList = await bUser.find({userFrom: currentUser.userId});
  } else {
    groups = [];
    blockedList = [];
  }

  approvedSellingProducts.forEach(function(pro) {    
    // returning rate & currency according to the currency conversion    
    if (pro.currencyCode != req.headers.currency && pro.currencyCode != "") {
          var productCurrentRate = currencies.find((c) => c.code == pro.currencyCode);   
          productConversionRate = (pro.rate / productCurrentRate.rate).toFixed(2);
          pro.rate = (productConversionRate * chosenCurrency.rate).toFixed(2);   
    }

    if (pro.currencyCode != req.headers.currency && pro.currencyCode != ""){
      pro.currencyCode = req.headers.currency;
    }

    if (pro.currencyCode) {
        for(var i=0; i<currencies.length; i++) {
            if (currencies[i].code == pro.currencyCode) {
                pro.currencySymbol = currencies[i].symbol;
            }
        }
    }    
  
  });
if (filter) {
  if (filter.rangeFilter && filter.rangeFilter.length > 0) {
    rangeFilterProducts = [];
    approvedSellingProducts.map((j) => {
    filteredProduct = [];
    filter.rangeFilter.map((i) => {
        if (i.rangeFrom && i.rangeTo) {
          var rangeData = j.categoryFields.filter((a) => a.rangeValue >= i.rangeFrom && a.rangeValue <= i.rangeTo && a.fieldId == i.fieldId)
        }
        if (i.rangeFrom && !i.rangeTo) {
          var rangeData = j.categoryFields.filter((a) => a.rangeValue >= i.rangeFrom && a.fieldId == i.fieldId)
        }
        if (i.rangeTo && !i.rangeFrom) {
          var rangeData = j.categoryFields.filter((a) => a.rangeValue <= i.rangeTo && a.fieldId == i.fieldId)
        }
          if(rangeData && rangeData.length > 0) {
            filteredProduct.push(j)
          }          
      })
      if (filteredProduct.length === filter.rangeFilter.length) {
        rangeFilterProducts.push(filteredProduct[0])
      }
    })
    approvedSellingProducts = rangeFilterProducts
    products =  rangeFilterProducts.sort((a,b) => { return b.createdAt - a.createdAt }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
  }

  if (filter.rateFrom && filter.rateTo) {    
    approvedSellingProducts = approvedSellingProducts.filter((a) => a.rate >= filter.rateFrom && a.rate <= filter.rateTo);

    products =  approvedSellingProducts.sort((a,b) => { return b.createdAt - a.createdAt }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
    
    if (filter.sortBy == 1){
      products =  approvedSellingProducts.sort((a,b) => { return a.rate - b.rate }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
    }
    if (filter.sortBy == 2){
      products =  approvedSellingProducts.sort((a,b) => { return b.rate - a.rate }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
    }
    if (filter.sortBy == 3){
      products =  approvedSellingProducts.sort((a,b) => { return b.location - a.location }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
    }
  }

  if (filter.rateFrom && !filter.rateTo) {
    approvedSellingProducts = approvedSellingProducts.filter((a) => a.rate >= filter.rateFrom);

    products =  approvedSellingProducts.sort((a,b) => { return b.createdAt - a.createdAt }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);

    if (filter.sortBy == 1){
      products =  approvedSellingProducts.sort((a,b) => { return a.rate - b.rate }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
    }
    if (filter.sortBy == 2){
      products =  approvedSellingProducts.sort((a,b) => { return b.rate - a.rate }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
    }
    if (filter.sortBy == 3){
      products =  approvedSellingProducts.sort((a,b) => { return b.location - a.location }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
    }
  }

  if (!filter.rateFrom && filter.rateTo) {
    approvedSellingProducts = approvedSellingProducts.filter((a) => a.rate <= filter.rateTo);

    products =  approvedSellingProducts.sort((a,b) => { return b.createdAt - a.createdAt }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
    
    if (filter.sortBy == 1){
      products =  approvedSellingProducts.sort((a,b) => { return a.rate - b.rate }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
    }
    if (filter.sortBy == 2){
      products =  approvedSellingProducts.sort((a,b) => { return b.rate - a.rate }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
    }
    if (filter.sortBy == 3){
      products =  approvedSellingProducts.sort((a,b) => { return b.location - a.location }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
    }
  }

  if (filter.sortBy && filter.sortBy != 0) {
    if (filter.sortBy == 1){
      products =  approvedSellingProducts.sort((a,b) => { return a.rate - b.rate }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
    }
    if (filter.sortBy == 2){
      products =  approvedSellingProducts.sort((a,b) => { return b.rate - a.rate }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
    }
    if (filter.sortBy == 3){
      products =  approvedSellingProducts.sort((a,b) => { return b.location - a.location }).slice(((pageNumber === undefined ? 1 : pageNumber)-1)*paginate, (((pageNumber === undefined ? 1 : pageNumber)-1)*paginate) + paginate);
    }
  }
}
    products.forEach(function(pro) {
    
      fName = pro && pro.language && pro.language.filter((f) => f.langCode === req.headers.lang);
        if (fName && fName.length === 0){                        
            fName = pro && pro.language && pro.language.filter((f) => f.langCode === "en");
        }
        fName && fName.map(i => {          
          pro.title = i.title,
          pro.description = i.description;                       
        });

      if (pro.location && pro.location.lat_lon && pro.location.lat_lon.length) {
        var temp = pro.location.lat_lon[0];
        pro.location.lat_lon[0] = pro.location.lat_lon[1];
        pro.location.lat_lon[1] = temp;
      }

      if(pro && pro.categoryFields) {
        pro.categoryFieldsInfo = [];
        
        pro && pro.categoryFields && pro.categoryFields.map((i) => {
          var catField = (filterData && filterData.find((f) => f.id == i.fieldId) || []);
          var catFieldLanguageParent = catField && catField.language && catField.language.map((i) => {
            valueParentData = i && i.values && i.values.map((a) => {
              return a.valueParent
            });            
          return valueParentData;
          });
  
          if (catFieldLanguageParent && catFieldLanguageParent.length > 0) {
            for (x = 0; x<catFieldLanguageParent.length; x++) {
              if ((catFieldLanguageParent[x].indexOf(i.fieldParent)) >= 0) {
                var parentIndex = catFieldLanguageParent[x].indexOf(i.fieldParent);
              }              
            }
          }

          var catFieldLanguageChild = catField && catField.language && catField.language.map((a) => {
            valueChildData = a && a.values && a.values.map((a) => {
              vC = a && a.valueChild && a.valueChild.map((b) => {                
                return b.valueChildData
              })
              return vC
            });     
          return valueChildData;
          });
          
          var catFieldLanguageChildName = catField && catField.language && catField.language.map((a) => {
            valueChildDataName = a && a.values && a.values.map((a) => {
              vCName = a && a.valueChild && a.valueChild.map((b) => {
                if (b._id == i.fieldChild) {
                  return b.valueChildData
                }
              })
              return vCName
            });     
          return valueChildDataName;
          });

          if(catFieldLanguageChildName && catFieldLanguageChildName.length > 0) {            
              arr = catFieldLanguageChildName.filter(e => String(e).trim());
              if (arr.length > 0){
                names = arr.join("").toString()
                childName = names.replace(/,/g, "")
              }
            }
         
          if (catFieldLanguageChild && catFieldLanguageChild.length > 0) {  
              for (z = 0; z<catFieldLanguageChild.length; z++) {
                for (y = 0; y<catFieldLanguageChild[z].length; y++) {
                  if ((catFieldLanguageChild[z][y].indexOf(childName)) >= 0) {
                        var childIndex = catFieldLanguageChild[z][y].indexOf(childName);
                  }                
                } 
              }                                                         
          }

          var fName = catField && catField.language && catField.language.filter((f) => f.langCode === req.headers.lang);
          if (fName && fName.length === 0){                        
              fName = catField && catField.language && catField.language.filter((f) => f.langCode === "en");
          }
          fName && fName.map((j) => {
            categoryFieldsData = {};            
            j && j.values && j.values.map((v) => {
              if (!!v.valueParent && v.valueChild && !(i.rangeValue)){
                if(j.values[parentIndex] != undefined) {
                  categoryFieldsData.fieldParent = j.values[parentIndex].valueParent;
                }
                if(j.values[0].valueChild[childIndex] != undefined) {
                  categoryFieldsData.fieldChild = j.values[parentIndex].valueChild[childIndex]._id;                
                  categoryFieldsData.fieldChildName = j.values[parentIndex].valueChild[childIndex].valueChildData
                }
              }
              if (!!v.valueChild && !v.valueParent && !(i.rangeValue)){
                if(j.values[0].valueChild[childIndex] != undefined) {
                  categoryFieldsData.fieldChild = j.values[0].valueChild[childIndex]._id;                
                  categoryFieldsData.fieldChildName = j.values[0].valueChild[childIndex].valueChildData
                }
              }
            })
            categoryFieldsData.fieldName = j.name;
            categoryFieldsData.fieldId = i.fieldId;
            categoryFieldsData.rangeValue = i.rangeValue;
            categoryFieldsData.inputTag = catField.inputTag;
            categoryFieldsData.rangeMinValue = catField.min;
            categoryFieldsData.rangeMaxValue = catField.max;
            
            pro.categoryFieldsInfo.push(categoryFieldsData)
          });              
        });
      }

      if (pro.categoryId) {
        var ci = (categories.find((cat) => cat.id == pro.categoryId) || []);        
        var fName = ci && ci.language && ci.language.filter((f) => f.langCode === req.headers.lang);
          if (fName && fName.length === 0){                        
              fName = ci && ci.language && ci.language.filter((f) => f.langCode === "en");
          }
          fName && fName.map((i) => {                        
             pro.category = i.name;
          });     
      }
      if (groups && groups.length) {
        groups.forEach((group) => {
          if(group.productId == pro._id) {
            pro.groupsId = group.id;
            pro.groupsName = group.groupName;
          }
        });
      }
      if (pro.userId) {
        pro.isBlocked = !!((blockedList.find((bl) => bl.userTo == pro.userId ) || {}).id) || false;
        pro.userName = (users.find((u) => u._id == pro.userId) || {}).userName;
      }
      if (currentUser.userId && pro) {
        if(currentUser.userId == pro.userId) {
          pro.chatType = "seller";
        } else {
          pro.chatType = "buyer";
        }
      }
      if (pro.images && pro.images.length) {
        for (var i=0; i<pro.images.length; i++) {
          if(pro.images[i] == ""){
          pro.images[i] = `${URL+req.headers.host}/fileStorage/static/defaultproduct.png`;
          } else if (pro.images[i] != "") {
            pro.images[i] = `${URL+req.headers.host}/fileStorage/uploads/products/${String(pro._id)}/${pro.images[i]}`;
          }
        }
      }
      // returning rate & currency according to the currency conversion    
      if (pro.currencyCode != req.headers.currency && pro.currencyCode != "") {
            var productCurrentRate = currencies.find((c) => c.code == pro.currencyCode);   
            productConversionRate = (pro.rate / productCurrentRate.rate).toFixed(2);
            pro.rate = (productConversionRate * chosenCurrency.rate).toFixed(2);   
      }
  
      if (pro.currencyCode != req.headers.currency && pro.currencyCode != ""){
        pro.currencyCode = req.headers.currency;
      }
  
      if (pro.currencyCode) {
          for(var i=0; i<currencies.length; i++) {
              if (currencies[i].code == pro.currencyCode) {
                  pro.currencySymbol = currencies[i].symbol;
              }
          }
      }    
      if (pro.userId) {
          for(var i=0; i<users.length; i++) {
              if (users[i]._id == pro.userId) {
                  var imagePath = users[i].profileImage ?
                   (users[i].profileImage.indexOf("graph.facebook.com") >=0 || users[i].profileImage.indexOf("googleusercontent.com") >=0) ? 
                   users[i].profileImage : `${URL+req.headers.host}/fileStorage/uploads/users/${String(pro.userId)}/${users[i].profileImage}`
                   : `${URL+req.headers.host}/fileStorage/static/default.png`;
                  // if(!fs.existsSync(`fileStorage/uploads/users/${String(pro.userId)}/${users[i].profileImage}`)) {
                  //   imagePath = `${URL+req.headers.host}/fileStorage/static/default.png`;
                  //   }
                  pro.userProfile = imagePath;
                 //pro.ejabberId = users[i].ejabberId;
              }
          }
        }
        if (pro.createdAt) {
          pro.timeAgo = dateAdd(pro.createdAt);
        }
        if (type === "needMore") {
          if (currentUser.userId && pro.likedUsers.length) {
            pro.likedUsers.forEach(function(fav) {
                if (currentUser.userId == fav) {
                    return pro.isFav = true;
                }
            });
          }
          if (currentUser.userId && pro.viewers.length) {
            pro.viewers.forEach(function(view) {
              if (currentUser.userId == view || currentUser.userId == pro.userId) { return pro.viewed = true; }
            });
          }
        }
        
        //pro.ProductsCount = approvedSellingProducts.length        
        // pro.ProductsCount = Math.ceil(approvedSellingProducts.length / paginate)
       
       if (pro.featured != null) {
          featuredData = featuredDetails.find((f) => f._id == pro.featured);
            fName = featuredData.language.filter((f) => f.langCode === req.headers.lang);
              if (fName.length === 0){                        
                  fName = featuredData.language.filter((f) => f.langCode === "en");
              }
                fName.map((i) => {
                  pro.featuredName = i.name,
                  pro.featuredDescription = i.description;                     
              });
        }
      });
    
    return products;
  };

  // cofiguration for sort
  const sortConfig = [
    {key:0, value: "createdAt", order:"-"},
    {key:1, value: "rate", order:""},
    {key:2, value: "rate", order:"-"},
    {key:3, value:"location", order: null},
  ];

  // reusable function to get admin products from DB 
  const updateAdminFetchedProducts = async (data, products, type) => {
    let {user, currency, req, currentUser, chat, category,filterCategory, bUser, featured, transaction} = data;
    
    const users = await user.find({}, "profileImage userName");
    var categories = await category.find({}, "name type");
    const currencies = await currency.find({}, "code symbol");
    var filterData = await filterCategory.find({});
  
    if (currentUser.userId) {
      var groups = await chat.find({userId: currentUser.userId});
      var blockedList = await bUser.find({userFrom: currentUser.userId});
    } else {
      groups = [];
      blockedList = [];
    }
  
      products.forEach(function(pro) {
      
      if (pro.location && pro.location.lat_lon && pro.location.lat_lon.length) {
        var temp = pro.location.lat_lon[0];
        pro.location.lat_lon[0] = pro.location.lat_lon[1];
        pro.location.lat_lon[1] = temp;
      }
  
      if(pro.categoryFields) {
        pro.categoryFieldsInfo = [];
        
        pro && pro.categoryFields && pro.categoryFields.map((i) => {
          var catField = (filterData && filterData.find((f) => f.id == i.fieldId) || []);
  
          var catFieldLanguageParent = catField && catField.language && catField.language.map((i) => {
            valueParentData = i && i.values && i.values.map((a) => {
              return a.valueParent
            });            
          return valueParentData;
          });
  
          if (catFieldLanguageParent && catFieldLanguageParent.length > 0) {
            for (x = 0; x<catFieldLanguageParent.length; x++) {
              if ((catFieldLanguageParent[x].indexOf(i.fieldParent)) >= 0) {
                var parentIndex = catFieldLanguageParent[x].indexOf(i.fieldParent);
              }              
            }
          }
  
          var catFieldLanguageChild = catField && catField.language && catField.language.map((a) => {
            valueChildData = a && a.values && a.values.map((a) => {
              vC = a && a.valueChild && a.valueChild.map((b) => {                
                return b.valueChildData
              })
              return vC
            });     
          return valueChildData;
          });
          
          var catFieldLanguageChildName = catField && catField.language && catField.language.map((a) => {
            valueChildDataName = a && a.values && a.values.map((a) => {
              vCName = a && a.valueChild.map((b) => {
                if (b._id == i.fieldChild) {
                  return b.valueChildData
                }
              })
              return vCName
            });     
          return valueChildDataName;
          });
  
          if(catFieldLanguageChildName && catFieldLanguageChildName.length > 0) {            
              arr = catFieldLanguageChildName.filter(e => String(e).trim());
              if (arr.length > 0){
                names = arr.join("").toString()
                childName = names.replace(/,/g, "")
              }
            }
         
          if (catFieldLanguageChild && catFieldLanguageChild.length > 0) {  
              for (z = 0; z<catFieldLanguageChild.length; z++) {
                for (y = 0; y<catFieldLanguageChild[z].length; y++) {
                  if ((catFieldLanguageChild[z][y].indexOf(childName)) >= 0) {
                        var childIndex = catFieldLanguageChild[z][y].indexOf(childName);
                  }                
                } 
              }                                                         
          }
  
          var fName = catField && catField.language && catField.language.filter((f) => f.langCode === req.headers.lang);
          if (fName && fName.length === 0){                        
              fName = catField && catField.language && catField.language.filter((f) => f.langCode === "en");
          }
          fName && fName.map((j) => {
            categoryFieldsData = {};            
            j && j.values && j.values.map((v) => {
              if (!!v.valueParent && v.valueChild && !(i.rangeValue)){
                if(j.values[parentIndex] != undefined) {
                  categoryFieldsData.fieldParent = j.values[parentIndex].valueParent;
                }
                if(j.values[0].valueChild[childIndex] != undefined) {
                  categoryFieldsData.fieldChild = j.values[parentIndex].valueChild[childIndex]._id;
                }
               // categoryFieldsData.fieldChildName = j.values[parentIndex].valueChild[childIndex].valueChildData
              }
              if (!!v.valueChild && !v.valueParent && !(i.rangeValue)){
                if(j.values[0].valueChild[childIndex] != undefined) {
                  categoryFieldsData.fieldChild = j.values[0].valueChild[childIndex]._id;
                }
               // categoryFieldsData.fieldChildName = j.values[0].valueChild[childIndex].valueChildData
              }
            })
            categoryFieldsData.fieldName = j.name;
            categoryFieldsData.fieldId = i.fieldId;
            categoryFieldsData.rangeValue = i.rangeValue;
            pro.categoryFieldsInfo.push(categoryFieldsData)
          });              
        });
      }
  
      if (pro.categoryId) {
        var ci = (categories && categories.find((cat) => cat.id == pro.categoryId) || []);
        pro.category = ci.name;
      }
      if (groups && groups.length) {
        groups.forEach((group) => {
          if(group.productId == pro._id) {
            pro.groupsId = group.id;
            pro.groupsName = group.groupName;
          }
        });
      }
      if (pro.userId) {
        pro.isBlocked = !!((blockedList.find((bl) => bl.userTo == pro.userId ) || {}).id) || false;
        pro.userName = (users.find((u) => u._id == pro.userId) || {}).userName;
      }
      if (currentUser.userId && pro) {
        if(currentUser.userId == pro.userId) {
          pro.chatType = "seller";
        } else {
          pro.chatType = "buyer";
        }
      }
      if (pro.images && pro.images.length) {
        for (var i=0; i<pro.images.length; i++) {
          if(pro.images[i] == ""){
          pro.images[i] = `${URL+req.headers.host}/fileStorage/static/defaultproduct.png`;
          } else if (pro.images[i] != "") {
            pro.images[i] = `${URL+req.headers.host}/fileStorage/uploads/products/${String(pro._id)}/${pro.images[i]}`;
          }
        }
      }
      if (pro.currencyCode) {
          for(var i=0; i<currencies.length; i++) {
              if (currencies[i].code == pro.currencyCode) {
                  pro.currencySymbol = currencies[i].symbol;
              }
          }
      }
      if (pro.userId) {
          for(var i=0; i<users.length; i++) {
              if (users[i]._id == pro.userId) {
                  var imagePath = users[i].profileImage ?
                   (users[i].profileImage.indexOf("graph.facebook.com") >=0 || users[i].profileImage.indexOf("googleusercontent.com") >=0) ? 
                   users[i].profileImage : `${URL+req.headers.host}/fileStorage/uploads/users/${String(pro.userId)}/${users[i].profileImage}`
                   : `${URL+req.headers.host}/fileStorage/static/default.png`;
                  // if(!fs.existsSync(`fileStorage/uploads/users/${String(pro.userId)}/${users[i].profileImage}`)) {
                  //   imagePath = `${URL+req.headers.host}/fileStorage/static/default.png`;
                  //   }
                  pro.userProfile = imagePath;
                 //pro.ejabberId = users[i].ejabberId;
              }
          }
        }
        if (pro.createdAt) {
          pro.timeAgo = dateAdd(pro.createdAt);
        }
        if (type === "needMore") {
          if (currentUser.userId && pro.likedUsers.length) {
            pro.likedUsers.forEach(function(fav) {
                if (currentUser.userId == fav) {
                    return pro.isFav = true;
                }
            });
          }
          if (currentUser.userId && pro.viewers.length) {
            pro.viewers.forEach(function(view) {
              if (currentUser.userId == view || currentUser.userId == pro.userId) { return pro.viewed = true; }
            });
          }
        }
  
      });
    
      return products;
    };

  // cofiguration for feedback types
  // const feedBack = {
  //   "primaryLevel": ["Polite", "Showed up on time", "Quick responses", "Fair prices", "Helpful", "Trustworthy"],
  //   "secondaryLevel": ["Not Polite", "Didn"t show up", "Slow responses", "Unfair prices", "Item not as advertised", "Not trustworthy"]
  // };
// console.log(feedBack)

const feedBackTemplate = (req) => {
  feedBack = {
    "primaryLevel": [typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Polite : language.en._Polite, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Showedupontime : language.en._Showedupontime, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Quickresponses : language.en._Quickresponses, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Fairprices : language.en._Fairprices, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Helpful : language.en._Helpful, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Trustworthy : language.en._Trustworthy],
    "secondaryLevel": [typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._NotPolite : language.en._NotPolite, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Didnotshowup : language.en._Didnotshowup, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Slowresponses : language.en._Slowresponses, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Unfairprices : language.en._Unfairprices, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Itemnotadvertised : language.en._Itemnotadvertised, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Nottrustworthy : language.en._Nottrustworthy]
  };
  return feedBack;      
};

  // configuration for delete operation
  const mapConfig = (params) => {
    let { user, category, filterCategory, product, admin, chat, currency, reason, feedBack,featured,adBanner,language,metatags,staticPages } = params;
    var configArray = [
      {key: "category", value: category},
      {key:"product", value: product},
      {key:"admin", value: admin},
      {key:"chat", value: chat},
      {key:"user", value: user},
      {key:"currency", value: currency},
      {key:"reason", value: reason},
      {key:"feedback", value : feedBack},
      {key:"featured", value: featured},
      {key:"banner", value: adBanner},
      {key:"language",value:language},
      {key: "metatags", value:metatags},
      {key: "staticPages", value:staticPages},
      {key: "filterCategory", value:filterCategory}
  ];
  return configArray;
  };

  // configuration for map products & user reviews w.r.t types like ForSale, SoldOut, favourites
  // And review is to list user reviews
  const typeConfig = [
    {key:1, value: "ForSale"},
    {key:2, value:"SoldOut"},
    {key:3, value: "favourites"},
    {key:4, value:"review"}
  ];

// reusable function to send token to user email id 
var sendToken = function(params, callback) {
  var {email, user, req, emailAdmin,mailtemp,site} = params;
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString("hex");
        done(err, token);
      });
    },
    function(token, done) {
      user.findOne({email}, function(err, foundUser) {
        foundUser.resetPasswordToken = token;
        foundUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        foundUser.save(function(err) {
          done(err, token, foundUser);
        });
      });
    },
    async function(token, foundUser, done) {
      var headermailtempDetail = await mailtemp.findOne({title: "header"}, "mailcontent");
      var bodymailtempDetail = await mailtemp.findOne({title: "forgot_password"});  
      var footermailtempDetail = await mailtemp.findOne({title: "footer"}, "mailcontent");
      let reqPath = `${process.env.URL + req.headers.host}/fileStorage/uploads/img`; 
      var getDefault = await site.find({});
      var sites = getDefault.find((a) => a);
      let link = `${REACT_APP_Domain_Url+"reset-password/" + token}`  ;
      //let link = "http://localhost:3000/reset-password/"+token;
      let headerlink = `${URL + Site_Url}`; 
      let facebookLink = `${sites.fbLink }`;                                           
      let fbshow = "display:none";
      if(facebookLink){
          fbshow = "";                    
      }                   
      let instagramlink = `${sites.instagramLink}`; 
      let instagramshow = "display:none";
      if(instagramlink){
          instagramshow = "";                 
      }                     
      let twitterLink = `${sites.twLink}`;
      let twittershow = "display:none";
      if(twitterLink){
          twittershow = "";                    
      }  
      let youtubeLink = `${sites.utubeLink}`;
      let youtubeshow = "display:none";
      if(youtubeLink){
          youtubeshow = "";                   
      }                   
      var etempdataDynamic = headermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{HEADERLINK}}/g, headerlink) + bodymailtempDetail.mailcontent.replace(/{{USERNAME}}/g, foundUser.userName).replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{LINK}}/g, link).replace(/{{RESET}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._reset : language.en._reset).replace(/{{SITENAME}}/g, sites.fromName).replace(/{{PASSWORD}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._password : language.en._password).replace(/{{HI}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._hi : language.en._hi).replace(/{{RESETCONTENT}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._resetContent : language.en._resetContent).replace(/{{SETPASSWORD}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._setPassword : language.en._setPassword).replace(/{{IGNOREMAIL}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._ignoreMail : language.en._ignoreMail) + footermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{FACEBOOKLINK}}/g, facebookLink).replace(/{{FBSHOW}}/g, fbshow).replace(/{{INSTAGRAMLINK}}/g, instagramlink).replace(/{{INSTAGRAMSHOW}}/g, instagramshow).replace(/{{TWITTERLINK}}/g, twitterLink).replace(/{{TWITTERSHOW}}/g, twittershow).replace(/{{YOUTUBELINK}}/g, youtubeLink).replace(/{{YOUTUBESHOW}}/g, youtubeshow);
      // var emailAdmin = await site.findOne({}, "fromAddress fromName uName password");         
      // call the function for sending password reset token to the user`s email
      // return sendToken({email, user, req, emailAdmin});
      var mailAddr = email;
       let values = {
           to: mailAddr,    // email 
           html: etempdataDynamic,
           req: req
       };

      sendMailAction.sendMail("forgetPwd",values, mailAddr, function(err, res) {
              done(err, res);
            });
          }
        ], function(err) { if (err) console.log("err",err); });
        return { result: typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._successMailSend : language.en._successMailSend };
      }

      // reusable function to create non existing path
  const createPath = (imagePath, name) => {
        if(!fs.existsSync(imagePath)) {
          fs.mkdirSync(imagePath);
        }
        return path.join(imagePath, name);
    }

// store uploaded files in specified path (Web Services)
  const storeUpload = ({ stream }, filename, id, type) => 
    new Promise((resolve, reject) =>
    stream
      .pipe(fs.createWriteStream(createPath(path.join("fileStorage", "uploads", type, String(id)), filename)))
      .on("finish", () => resolve())
      .on("error", reject)
  );

module.exports = {
  createToken,
  imageUpload,
  date,
  getUser,
  findUser,
  deleteImage,
  isBase64,
  dateAdd,
  socialLogin,
  updateFetchedProducts,
  sortConfig,
  sendToken,
  typeConfig,
  storeUpload,
  mapConfig,
  feedBackTemplate,
  options,
  updateAdminFetchedProducts,
  getClientSecret,
  getUserId
};

