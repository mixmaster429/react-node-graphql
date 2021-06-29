var bcrypt = require("bcrypt");
const {errors} = require("../../error");
const language = require("../../src/translations/api/lang.json");
var fs = require("fs");
var path = require("path");
var { AuthenticationError, ForbiddenError, UserInputError } = require("apollo-server");
const {dateAdd, date, imageUpload, findUser, deleteImage, socialLogin, sendToken, updateFetchedProducts, typeConfig, createToken} = require("../../handler");
const sendMailAction = require("../../mailtemp");
const {URL, Site_Url, env} = process.env;

const paginate = 10;
const REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const resolvers = {
    Query: {
        // get all registered users detail
        getAllUsers: async (root, args, {currentUser, user}) => {
            if(currentUser.adminUserId) {
                const Users = await user.find({});
                return Users;
            } else {
            throw new AuthenticationError(errors.unauthorized);
            }
        },
        // get specific user details by id
        getUserDetails: async (root, {id, pageNumber, type}, params) => {
            var filter = {};
            var filters = {};
            const {user,currentUser, product, req, review, bUser} = params;            
            var userId;
            if (!!req.headers.authorization && !currentUser.userId) {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
            if (id) {
                var reviews = await review.find({userTo: id}, "ratings");
                var averageRating = 0;
                reviews.forEach((r) => (averageRating += r.ratings)); // average review rating of a user

                // get user details from db
                var foundUser = currentUser.userId ? id == currentUser.userId
                ? await user.findOne({_id: currentUser.userId}).select("-password -resetPasswordToken")
                : await user.findOne({_id: id}, "_id location profileImage userName bio email status updatedAt createdAt")
                : await user.findOne({_id: id}, "_id location profileImage userName bio email status updatedAt createdAt");

                // check whether the found user blocked by current user in the condition `id != currentUser.userId`
                if (currentUser.userId && id != currentUser.userId) {
                    var foundBlocked = await bUser.findOne({userFrom: currentUser.userId, userTo: id});
                    if (foundBlocked) {
                        foundUser.isBlocked = !!foundBlocked.id;
                    }
                    else {
                        foundUser.isBlocked = false;
                    }
                }
            }
            if (foundUser) {
                foundUser.profileImage = foundUser.profileImage ? (foundUser.profileImage.indexOf("graph.facebook.com") >=0 || foundUser.profileImage.indexOf("googleusercontent.com") >=0) ? 
                foundUser.profileImage :`${process.env.URL + req.headers.host}/fileStorage/uploads/users/${String(foundUser._id)}/${foundUser.profileImage}` : `${process.env.URL + req.headers.host}/fileStorage/static/default.png`;
                foundUser.userRating = reviews.length ? averageRating/reviews.length : 0;
            }
            var foundProducts = await product.find({"userId": id, "isDeleted": false});
            if (!!foundUser) {
                var data = {};
                var users;
                var favourites = (await user.findOne({_id: id})) ; 
                if (!!foundProducts && !type) {
                    // get all products under `forsale`, `soldout`, `favourites` & `user reviews`
                    data.ForSale = await product.find({userId: id, isDeleted: false, status: "Approved" ,sellingStatus: "ForSale"});
                    data.SoldOut = await product.find({userId: id, isDeleted: false,  status: "Approved" ,sellingStatus: "SoldOut"});
                    data.review = await review.find({userTo: id}).sort("-createdAt");
                    if (data.review && data.review.length) {
                        users = await user.find({}, "userName profileImage");
                        data.review.forEach((gid) => {
                            if (gid.updatedAt) {
                                gid.timeAgo = dateAdd(gid.updatedAt);
                            }
                            var find = users.find((u) => u.id == gid.userFrom);
                            var to = users.find((u) => u.id == gid.userTo);
                            gid.imageUrl = find && find.profileImage ? (find.profileImage.indexOf("graph.facebook.com") >=0 || find.profileImage.indexOf("googleusercontent.com") >=0) ? 
                            find.profileImage : `${process.env.URL+req.headers.host}/fileStorage/uploads/users/${gid.userFrom}/${find.profileImage}` : `${URL + req.headers.host}/fileStorage/static/default.png`;
                            gid.fromName = find && find.userName;
                            //gid.toName = (users.find((u) => u.id = id) || {}).userName;
                            gid.toName = to && to.userName;  // to.userName alone  
                        });
                    }
                    if (currentUser.userId && id == currentUser.userId) {
                        data.favourites = await product.find({"_id": {$in:favourites.favourites} , status: "Approved"});
                    }
                } else if(!!foundProducts && type && pageNumber) {
                    // get type values w.r.t types..
                    var typeVal = typeConfig.filter((ty) => {return ty.key == type})[0].value;
                    // get all the products favourited by the current user
                    if (typeVal == "favourites" && currentUser && id == currentUser.userId) {
                        data["favourites"] = await product.find({"_id": {$in:favourites.favourites},  status: "Approved"}).skip((pageNumber-1)*paginate).limit(paginate);                                           

                    }
                    // get all user reviews for current user
                    else if (typeVal === "review") {
                        data["review"] = await review.find({userTo: id}).sort("-createdAt").skip((pageNumber-1)*paginate).limit(paginate);
                        if (data.review && data.review.length) {
                            users = await user.find({}, "userName profileImage");
                            data.review.forEach((gid) => {
                                if (gid.updatedAt) {
                                    gid.timeAgo = dateAdd(gid.updatedAt);
                                }
                                var find = users.find((u) => u.id == gid.userFrom);
                                var to = users.find((u) => u.id == gid.userTo);                                
                                gid.imageUrl = find && find.profileImage ? (find.profileImage.indexOf("graph.facebook.com") >=0 || find.profileImage.indexOf("googleusercontent.com") >=0) ? 
                                find.profileImage : `${process.env.URL+req.headers.host}/fileStorage/uploads/users/${gid.userFrom}/${find.profileImage}` : `${URL + req.headers.host}/fileStorage/static/default.png`;                   
                                gid.fromName = find && find.userName;
                                //gid.toName = (users.find((u) => u.id = id) || {}).userName;
                                gid.toName = to && to.userName;  // to.userName alone  
                            });
                        }
                    }
                    // get products under `forsale`
                    else if (typeVal === "ForSale" && id) {
                        data[typeVal] = typeVal && await product.find({userId: id, isDeleted: false, status: "Approved", sellingStatus: `${typeVal}`}).skip((pageNumber-1)*paginate).limit(paginate);
                    }
                    // get products under "SoldOut"
                    else if (typeVal === "SoldOut"&& id) {
                        data[typeVal] = typeVal && await product.find({userId: id, isDeleted: false, status: "Approved", sellingStatus: `${typeVal}`}).skip((pageNumber-1)*paginate).limit(paginate);
                    }
                }             
                // Mapping all products under `forsale`, `soldout`, `favourites` & users `reviews` into single object w.r.t keys
                Object.keys(data).forEach(function(key) {                  
                    if (key !== "review") {
                        data[key] = updateFetchedProducts(pageNumber, filters, filter, params, data[key],"needMore");
                    }
                });
                return {...data, foundUser};
            }
        }
    },
    Mutation: {

        // register new user
        signup : async (root, { data }, {user,req, site, currency,mailtemp, currentUser}) => {
                data.email = data.email.toLowerCase();                
                if (!REGEX.test(data.email)) {
                    throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._invalidEmail : language.en._invalidEmail);
                }
                const foundUser =  await user.findOne({email: data.email});
                if (foundUser) {
                    throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._alreadyExists : language.en._alreadyExists);
                }
                const newUser = await new user(data).save();
                //await user.findOneAndUpdate({_id: newUser._id});
                let result = findUser(newUser, "", {headers: req.headers, site, currency}); // call the function to get the expected output                
                if(!("type" in data)){
                    if (req.session && !req.headers.channel && !req.session.role) {
                        // update session values to use througout the session exists
                        req.session.userId = newUser.id;
                        req.session.role = newUser.role;
                        req.session.userName = newUser.userName;
                    }
                }
                // const token = createToken(newUser, process.env.JWT_SECRET, "1d")
                var headermailtempDetail = await mailtemp.findOne({title: "header"}, "mailcontent");
                var bodymailtempDetail = await mailtemp.findOne({title: "confirmation-mail"});  
                var footermailtempDetail = await mailtemp.findOne({title: "footer"}, "mailcontent");
                let reqPath = `${process.env.URL + req.headers.host}/fileStorage/uploads/img`;
                var getDefault = await site.find({});
                var sites = getDefault.find((a) => a);
                let link = `${URL + Site_Url}`;
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
                var etempdataDynamic = headermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{HEADERLINK}}/g, link) + bodymailtempDetail.mailcontent.replace(/{{USERNAME}}/g, newUser.userName).replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{LINK}}/g, link).replace(/{{HI}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._hi : language.en._hi).replace(/{{WELCOME}}/g, typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._Welcome : language.en._Welcome).replace(/{{SITENAME}}/g, sites.fromName) + footermailtempDetail.mailcontent.replace(/{{DEFAULTIMG}}/g, reqPath).replace(/{{FACEBOOKLINK}}/g, facebookLink).replace(/{{FBSHOW}}/g, fbshow).replace(/{{INSTAGRAMLINK}}/g, instagramlink).replace(/{{INSTAGRAMSHOW}}/g, instagramshow).replace(/{{TWITTERLINK}}/g, twitterLink).replace(/{{TWITTERSHOW}}/g, twittershow).replace(/{{YOUTUBELINK}}/g, youtubeLink).replace(/{{YOUTUBESHOW}}/g, youtubeshow);
                var mailAddr = newUser.email;
                let values = {
                     to: mailAddr,    // email 
                     html: etempdataDynamic,
                     req: req
                 };
                 sendMailAction.sendMail("confirmationMail",values, mailAddr, (callback) => {
                //   console.log("cb", callback)
                 });
                return result;
        },

        // login with social media credentials like facebook, google...
        socialLogin: async (root, {data}, {user, req, site, currency}) => {
                if (data.faceBookId) {
                    return socialLogin(user, data, {faceBookId: data.faceBookId}, {req, site, currency});
                } else if (data.googleId) {
                    return socialLogin(user, data, {googleId: data.googleId}, {req, site, currency});
                } else if(data.appleId){
                    return socialLogin(user, data, {appleId: data.appleId}, {req, site, currency});
                }
            },

        //login with already registered user credentials...
        signin: async (root, {email, password}, {user, req, site, currency}) => {
            if (!REGEX.test(email)) {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._invalidEmail : language.en._invalidEmail);
            }
            const foundUser = await user.findOne({email});
            if(!foundUser) {
                throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._usernotFound : language.en._usernotFound);
            }
            if (foundUser.status !== "Active") {
                throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._inActive : language.en._inActive);
            }
            if(foundUser.password === undefined){
                throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._PasswordFailed : language.en._PasswordFailed);
            }
            const isValid= await bcrypt.compare(password, foundUser.password);
            if(!isValid) {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._invalidPassword : language.en._invalidPassword);
            }
            let result = findUser(foundUser, "signin", {headers: req.headers, site, currency}); // call the function to get the expected output            
            if (req.session && !req.headers.channel) {
                // update session values to use througout the session exists
                req.session.userId = foundUser.id;
                req.session.role = foundUser.role;
                req.session.userName = foundUser.userName;
            }
            return result;
        },

        // edit user profile
        editProfile: async (root, { data }, { currentUser, user, req }) => {
            var {email, password, id, unit, profileImage, oldPassword, newPassword} = data;
            if(data.email) {
                data.email = data.email.toLowerCase();                
            }            
            let {userId, adminUserId} = currentUser;
            if(!userId && !adminUserId) {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }

            if (!!email && !REGEX.test(email)) {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._invalidEmail : language.en._invalidEmail);
            }

            const checkEmail =  await user.findOne({"_id": {$nin:id}, email: email});
            if (checkEmail) {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._emailExists : language.en._emailExists);
            }

            if(data.status === "Inactive") {                
                if(("type" in data)){                    
                    delete req.session.userId;
                    delete req.session.userName;
                    delete currentUser.userId;
                    delete currentUser.userName;                    
                }
            }
                if(password){
                    const saltRounds = 10;
                    data.password = await bcrypt.hash(password, saltRounds);
                }else if(!("type" in data) && !!oldPassword){
                    if(newPassword !== password) {
                        throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._passwordMatchError : language.en._passwordMatchError);
                    }
                    let foundUser = await user.findOne({ _id: data.id });
                    if(!foundUser) {
                        throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._usernotFound : language.en._usernotFound);
                    }
                    if (foundUser.status !== "Active") {
                        throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._inActive : language.en._inActive);
                    }
                    const isValid= await bcrypt.compare(oldPassword, foundUser.password);
                    if(!isValid) {
                        throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._invalidPassword : language.en._invalidPassword); 
                    }
                    const saltRounds = 10;
                    data.password = await bcrypt.hash(newPassword, saltRounds); 
                }
            

                data.updatedAt = date(); 
                if(("type" in data)){
                    /* condition for prevent maintain unique user name */
                    /* const checkUserName = await user.findOne({"_id": {$nin:data.id}, userName: data.userName});
                    if (checkUserName) throw new AuthenticationError(errors.userNameExists); */
                const foundUser = await user.findOneAndUpdate({_id: id}, {$set: data}, {new: true})
                .select("-password, -resetPasswordToken");
                
                if(!foundUser) {
                    throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._usernotFound : language.en._usernotFound);
                }
                return foundUser;

                  } 
                    if (unit) {                    
                        var bool = unit === "KM" ? true : unit === "MI" ? true : false;
                        if (!bool) {
                            throw new UserInputError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unitError : language.en._unitError);
                        }
                    }
                    if (profileImage) {
                        if(profileImage.includes("fakepath")) {
                            const fileName = profileImage.replace(/.*(\/|\\)/, "");
                            profileImage = fileName;
                        }
                        var found = await user.findOne({_id: userId});
                        if (found.profileImage) {
    
                            //delete old profile image while user tries to update new image
                            deleteImage(found.profileImage, found._id, "users");
                        }
                         // store newly uploaded user"s profile image in server
                        data.profileImage = imageUpload(profileImage, found._id, "users", "qwe");
                }
                const foundUser = await user.findOneAndUpdate({_id: userId}, {$set: data}, {new: true}).select("-password, -resetPasswordToken");
                if(!foundUser) {
                    throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._usernotFound : language.en._usernotFound);
                }
                return foundUser;
        },

        //  // api for get forgot password link via email of the user
        // forgotPassword: async(root, {email}, {user,mailtemp, req, site}) => {
        //     var foundUser = await user.findOne({email});
        //     if (!foundUser) throw new AuthenticationError("User " + errors.notFound);
        //     const token = createToken(foundUser, process.env.JWT_SECRET, "1d")
        //     console.log("token",token)
        //                  sendMailAction.sendMail("forgetPwd",values, callback => {
        //      })
        //       return sendToken({email, user, req, emailAdmin});
        //     //return { result: "Email sent successfully!" };
        // },
        
        // api for get forgot password link via email of the user
        forgotPassword: async(root, {email}, {user, req, site,mailtemp}) => {
            var emailAdmin = await site.findOne({}, "fromAddress fromName uName password");
            var foundUser = await user.findOne({email});
            if (!foundUser) {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._usernotFound : language.en._usernotFound);
            }
            //const token = createToken(foundUser, process.env.JWT_SECRET, "1d")
            // call the function for sending password reset token to the user`s email
            return sendToken({email, user, req, emailAdmin, mailtemp, site});
        },


        // api for reset the password through the reset password link
        resetPassword: async(root, { input }, {user, req}) => {
            const {password, confirmPassword, token} = input;
            if (password !== confirmPassword) {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._passwordMismatch : language.en._passwordMismatch);
            }
            if (password.length < 4) {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._passwordLength : language.en._passwordLength);
            }
            const foundUser = await user.findOne({resetPasswordToken: token});
            if (foundUser) {
                if (new Date(foundUser.resetPasswordExpires).getTime() < Date.now()) {
                    throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._expired : language.en._expired);
                }
                const saltRounds = 10;
                var passwordHash = await bcrypt.hash(password, saltRounds);
                await user.findOneAndUpdate({_id: foundUser._id}, {password: passwordHash, updatedAt: date()});
            } else {
                throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._usernotFound : language.en._usernotFound);
            }
                return (typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._resetSuccess : language.en._resetSuccess);
            }
        }
    };

module.exports = resolvers;