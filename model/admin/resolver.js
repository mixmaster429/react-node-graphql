var bcrypt = require("bcrypt");
const {errors} = require("../../error");
var nodemailer = require("nodemailer");
var { AuthenticationError, ForbiddenError, UserInputError } = require("apollo-server");
const {mapConfig} = require("../../handler");
const REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const { REACT_APP_EDIT_MODE } = process.env;

const resolvers = {
    Query: {

        //get all admin users information
        getAdminUsers: async (root, args, {currentUser, admin}) => {

            if(currentUser.adminUserId) {
                const AdminUsers = await admin.find({});
                return AdminUsers;
            }
        },
        
        //get a admin user details by id
        getAdminUser: async (root, {id}, {currentUser, admin}) => {

            if (currentUser.adminUserId) {
                const AdminUser = await admin.findOne({_id: id});
                return AdminUser;
            }
        },
        
        //get currently logged in user details for web services
        getCurrentUser: async(root, args, {currentUser, user, req, chat, message}) => {
            var {userId} = currentUser;
            if (userId) {
                const commonUser = await user.findOne({_id: userId});
                if (userId ) {
                    var chatResult1 = await chat.find({productuserId: userId});
                    var chatResult2 = await chat.find({userId: userId});          
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
                        commonUser.unreadMessage = filtered.length;                    
                    } else {
                        commonUser.unreadMessage = 0;
                    }           
                if(commonUser && commonUser.id && (commonUser.googleId || commonUser.faceBookId)){
                    commonUser.profileImage = (commonUser.profileImage.indexOf("graph.facebook.com") >=0 || commonUser.profileImage.indexOf("googleusercontent.com") >=0) ?
                    commonUser.profileImage : process.env.URL + req.headers.host+"/fileStorage/uploads/users/"+userId+"/"+commonUser.profileImage;
                }
                else if(commonUser && commonUser.id && !(commonUser.googleId || commonUser.faceBookId)) { 
                commonUser.profileImage = !!commonUser.profileImage ? process.env.URL + req.headers.host+"/fileStorage/uploads/users/"+userId+"/"+commonUser.profileImage 
                : process.env.URL + req.headers.host+"/fileStorage/static/default.png";
                }
                return commonUser;
            }
        },
        //get currently logged in admin user details for web services
        getCurrentAdmin: async(root, args, {currentUser, admin}) => {
            var {adminUserId} = currentUser;
            if(adminUserId) {
                const adminUser = await admin.findOne({_id: adminUserId});
                return adminUser;
            }
        },        
    },
    
    Mutation: {
        
        //login api for admin users
        adminLogin: async (root, {userName, password}, {admin, req}) => {

            const foundUser = await admin.findOne({userName});
            if(!foundUser){
                throw new ForbiddenError("Admin User "+errors.notFound);
            }

            if (foundUser.status !== "Active") {
                throw new ForbiddenError(errors.inActive);
            }

            const isValid= await bcrypt.compare(password, foundUser.password);
            if(!isValid) {
                throw new AuthenticationError(errors.invalidPassword);
            }

            req.session.adminUserId = foundUser.id;
            req.session.adminRole = foundUser.role;
            req.session.adminUserName = foundUser.userName;
            return true;
        },

        //update the admin details
        updateAdmin : async (root, {data}, {currentUser,admin}) => {
            var {adminRole, adminUserId} = currentUser;
            if (adminUserId) {
                var {id, status, email, userName, password} = data;

                // validation for email & password
                if (!!email && !REGEX.test(email)) {
                    throw new AuthenticationError(errors.invalidEmail);
                }
                if (!!password && password.trim().length < 4) {
                    throw new UserInputError(errors.passwordLength);
                }
                if (id) {
                    //edit already existing admin info
                    const foundExists =  await admin.findOne({"_id":id}, "role");
                    if (foundExists && foundExists.role === "SuperAdmin") {
                        if (adminRole !== "SuperAdmin" || status === "Inactive") {
                            throw new UserInputError(errors.denied);
                        }
                    }

                    const foundUser =  await admin.findOne({"_id": {$nin:id}, email: email});
                    if (foundUser) {
                        throw new AuthenticationError(errors.emailExists);
                    }
                    const foundUserWithName = await admin.findOne({"_id": {$nin:id}, userName: userName});
                    if (foundUserWithName) {
                        throw new AuthenticationError(errors.userNameExists);
                    }
                    delete data.id;

                    if (!!password) {
                        const saltRounds = 10;
                        data.password = await bcrypt.hash(password, saltRounds);
                    }

                    const updateUser = await admin.findOneAndUpdate({_id: id}, {$set: data}, {new: true}).then(function(data){
                        if (data) {
                            return true;
                        }
                    });
                    return updateUser;

                } else {
                    //create new admin user
                    const foundUser =  await admin.findOne({email: email});
                    if (foundUser) {
                        throw new AuthenticationError(errors.emailExists);
                    }
                    const foundUserWithName = await admin.findOne({userName: data.userName});
                    if (foundUserWithName) {
                        throw new AuthenticationError(errors.userNameExists);
                    }
                    const updateUser = await new admin(data).save().then(function(data){
                        if (data) {
                            return true;
                        }
                    });
                    return updateUser;
                }
            }
            throw new AuthenticationError(errors.noPermission);
        },

        //delete data from admin management like admins, users, products, categories,...
        delete: async(root, {id, typeConfig}, params)  => {
            let {
                currentUser, 
                product, 
                currency, 
                category, 
                filterCategory,
                reason,
                uReport,
                admin,
                feedBack,
                chat,
                featured,
                adBanner,
                language,
                metatags,
                staticPages,
                site
            } = params;
            var {adminUserId} = currentUser;
            var products = await product.find({});
            var uReports = await uReport.find({});
            var fb = await feedBack.find({});
            var fList = await featured.find({});
            
            if(REACT_APP_EDIT_MODE != "prod"){
                if (adminUserId) {
                
                    var model = (mapConfig(params).find((map) => map.key == typeConfig).value || " ");
                    var flag, chatUser;
                    switch (model.modelName) {
    
                        case "admin":
    
                        //delete record from admin model
                        var foundSuperAdmin = await admin.findOne({_id: id}, "role");
                        if (foundSuperAdmin && foundSuperAdmin.role === "SuperAdmin") {
                            throw new UserInputError(errors.denied);
                        }
                        break;
    
                        case "currency":
    
                        //delete record from currency model
                        var currencytoDel = await currency.findOne({_id: id}, "code");
                        var defaultFlag = await site.find({},"defaultCurrency");
                        if(defaultFlag[0].defaultCurrency === currencytoDel.code){
                            throw new UserInputError("Cannot Delete Default Currency");
                        }
                        flag = products.find((p) => p.currencyCode == currencytoDel.code);
                        if (flag) {
                            throw new UserInputError(`Currency ${errors.alreadyInUse} Currency Value!`);
                        }
                        break;
    
                        case "category":
                        
                        //delete record from category model
                        var categorytoDel = await category.findOne({_id: id}, "id");
                        flag = products.find((p) => p.categoryId == categorytoDel.id);
                        if (flag) {
                            throw new UserInputError(`Category ${errors.alreadyInUse} Category Type!`);
                        }
                        if (id === 1){
                            throw new UserInputError(`${errors.defaultCategory}`);
                        }
                        break;
    
                        case "filterCategory":
                        
                        //delete record from filter model
                        var filtertoDel = await filterCategory.findOne({_id: id}, "id");
                        var flag = await category.find({"fields.filterId": filtertoDel.id});
                        if (flag.length > 0) {
                            throw new UserInputError(`Filter ${errors.alreadyInUseFilter} filter Type!`);
                        }                       
                        break;                            
    
                        case "reason":
    
                        //delete record from reason model
                        var reasontoDel = await reason.findOne({_id: id}, "id");
                        flag = uReports.find((p) => p.reportId == reasontoDel.id);
                        if (flag) {
                            throw new UserInputError("Reason already used while reporting the user, so can't delete the Reason!");
                        }
                        break;
    
                        case "user":
                        
                        //delete record from user model
                        var userProducts = await product.count(
                            { userId: id }, function(err, c) { 
                                if (!err) {
                                    return c; 
                                }
                            }
                        );
                        chatUser = await chat.count(
                            { userId: id }, function(err, c) {
                                if (!err) {
                                    return c; 
                                }
                            }
                        );
                        if (userProducts > 0) {
                            throw new UserInputError("This user already having products, So can't delete the user.");
                        }
                        if (chatUser > 0) {
                            throw new UserInputError("This user already having conversations with products, So can't delete the user.");
                        }
                        break;
    
                        case "product":
                        chatUser = await chat.count(
                            { productId : id }, function(err, c) {
                                if (!err) {
                                    return c; 
                                }
                            }    
                        );
                        if (chatUser > 0) {
                            throw new UserInputError("This product already having conversations with users, So can't delete the product.");
                        }
                        break;                        
        
                        // case "feedBack":
                        // var feedbackDel = await feedBack.findOne({_id: id}, "id"); 
                        // var flag = fb.find(f=> f.id == feedbackDel.id);
                        // if(flag) throw new UserInputError(`Feedback ${errors.alreadyInUse} feedback Type!`);
                        // break;
    
                        case "featured":
                        //delete record from featured model
                        plan = await featured.findOne({_id: id}, "id");
                        flag = products.find((p) => p.featured == plan.id);
                        if(flag) {
                            throw new UserInputError(`Featured ${errors.alreadyInUse} featured Type!`);
                        }
                        break;
    
                        case "language":
                        plan = await language.findOne({_id: id});
                        var loop = [params.category, params.featured, params.staticPages, params.reason, params.metatags];
                        for (var i=0; i<loop.length; i++) {
                            var dataValue = await loop[i].find();
                            dataValue.map((item) => {
                                item.language.map((a) => {
                                    if (a.langCode == plan.value) {
                                        throw new UserInputError(`${loop[i].modelName} ${errors.cannotDeleteLanguage}`);
                                    }
                                });
                            });
                        }
                        break;
                    }
                    var deleted = await model.deleteOne({_id: id})
                    .setOptions({ single: true })
                    .then(function (deleted) {
                        if (deleted) {
                            return !!deleted.n;
                        }
                    });
                    return deleted;
                }
            } else{
                throw new UserInputError("Add/Edit Restricted for Live");
            }
        },

        // send client feedback to admin from landing page
        sendFeedBack: async(root, {data}, {site, admin}) => {
            var emailAdmin = await site.findOne({}, "fromAddress fromName uName password image");
            var activeAdmin = await admin.findOne({status: "Active"});
            if (data && activeAdmin) {
                let {name, feedBack, email} = data;
                let {uName, password, fromName, fromAddress} = emailAdmin;
                var smtpTransport = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false,
                    requireTLS: true,
                    auth: {
                      user: uName,
                      pass: password
                    }
                  });
                  var mailOptions = {
                    to: activeAdmin.email,
                    from: `${fromName +" "+ fromAddress}`,
                    subject: "Contact Us - Email",
                    text: `UserName: ${name} Email: ${email} FeedBack: ${feedBack}`
                        };
                        smtpTransport.sendMail(mailOptions, function(err, res) {
                            if (err) {
                                return err.message;
                            }
                            if (res) {
                                return "Message has been successfully sent";
                            }
                        });
                        return true;
            }
        },
        
        // logout api for both mobile/web services
        logOut: async(root, {type}, {req, currentUser, blackList, user}) => {
            let {authorization, channel} = req.headers;
            if (currentUser.userId && channel === "mobile" && !!authorization) {
                const updateBlackList = await new blackList({token: authorization}).save()
                .then(function(data){ 
                    if (data) {
                        return true; 
                    }
                });   
                var device = await user.findOne({_id: currentUser.userId});
                 if (device.deviceId != undefined){ 
                    var del = await user.findOneAndUpdate({_id: currentUser.userId}, { $unset: { deviceId: "" } });
                 }            
                return updateBlackList;
            } else if (type === "user" && currentUser.userId) {
                if (!currentUser.adminUserId) {
                    req.session.destroy();
                } else {
                    ["userId", "userName", "role"].forEach(function (k) {
                        delete currentUser[k];
                    });
                }
                return true;
            } else if (currentUser.adminUserId) {
                if (!currentUser.userId) {
                    req.session.destroy();
                } else {
                    ["adminUserId", "adminUserName", "adminRole"].forEach(function (k) {
                        delete currentUser[k];
                    });
                }
                return true;
            } else {
                throw new AuthenticationError(errors.unauthorized);
            }
        }
    }
};

module.exports = resolvers;