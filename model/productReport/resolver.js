
const {errors} = require("../../error");
const language = require("../../src/translations/api/lang.json");
const {AuthenticationError} = require("apollo-server");


const resolvers = {
    Query: {
        // get list of reported products by users
        getReportedProducts: async (root, args, {product, currentUser, pReport, user, req}) => {
            if(currentUser.adminUserId) {
                var foundReports = await pReport.find({});
                const userList = await user.find({}, "userName");
                const productlist = await product.find({});
                if (foundReports) {
                    foundReports.forEach((f) => {
                        var pl = productlist.find((p) => p.id == f.productId);
                        fTitle = pl.language.find((f) => f.langCode === "en");
                        if (fTitle.title) {
                            f.productName = fTitle.title;
                        }
                        var pu = userList.find((u) => u.id == pl.userId);
                        if (pu.userName) {
                            f.productUser = pu.userName;
                        }
                        var ul = userList.find((u) => u.id == f.userId);
                        if (ul.userName) {
                            f.user = ul.userName;
                        }
                    });
                    return foundReports;
                }
            } 
            else {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
        }
    },
    Mutation: {
        // api to report the products by the users for any reasons..
        updateProductReports: async (root, {productId, comments}, {currentUser, pReport, product, req}) => {
            var {userId} = currentUser;
            if (userId) {
                let fp = await product.findOne({_id: productId}, "userId");
                if (fp) {
                    var id = fp.userId;
                }
                if (id) {
                    if (userId != id) {
                        var foundReport = await pReport.findOne({
                            userId: userId,
                            productId: productId
                        }, function(err) {
                            if (err) {
                                console.error(err);
                            }
                        });
                        if (!foundReport) {
                            // report product listing
                            var newReport = await new pReport(
                                {
                                    userId: userId,
                                    productId: productId,
                                    comments: comments,
                                    timeStamp: Date.now()
                                }).save();
                                if (newReport) {
                                    return true;
                                }
                            } else {
                                // update reported information about the product
                                var updateReport = await pReport.findOneAndUpdate(
                                    {
                                        userId: userId,
                                        productId: productId
                                    },
                                    {
                                        userId: userId,
                                        productId: productId,
                                        comments: comments,
                                        timeStamp: Date.now()
                                    },
                                    { 
                                        upsert: true
                                    }
                                );
                                if (updateReport) {
                                    return true;
                                }
                            }
                            return false;
                        }
                    }
                }
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
        }
    };

module.exports = resolvers;