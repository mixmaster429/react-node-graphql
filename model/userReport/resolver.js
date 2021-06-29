
const {errors} = require("../../error");
const language = require("../../src/translations/api/lang.json");
const {AuthenticationError, ApolloError} = require("apollo-server");


const resolvers = {
    Query: {
        // get all reported users informations
        getUserReports: async (root, args, {reason, currentUser, uReport, user, req}) => {
            if(currentUser.adminUserId) {
                var foundReports = await uReport.find({});
                const reportList = await reason.find({});
                const userList = await user.find({}, "userName");
                if (foundReports && foundReports.length) {
                    foundReports.forEach((f) => {
                        var rl = reportList.find((r) => r.id == f.reportId);
                        if(rl){
                            var fName = rl.language.filter((f) => f.langCode === "en");
                            fName && fName.map((i) => {                         
                                f.reportName = i.name ;                 
                            });
                        }
                        var uf = userList.find((u) => u.id == f.userFrom);
                        if (uf.userName) {
                            f.fromName = uf.userName;
                        }
                        var ut = userList.find((u) => u.id == f.userTo);
                        if (ut.userName) {
                            f.toName = ut.userName;
                        }
                    });
                    return foundReports;
                }
            }
            throw new AuthenticationError(errors.unauthorized);
        }
    },
    Mutation: {
        // api for report a specific user by other user
        updateUserReports: async (root, {id, reportId, comments}, {currentUser, uReport, req}) => {
            if (currentUser.userId) {
                if (currentUser.userId != id) {
                    var foundReport = await uReport.findOne({
                        userFrom: currentUser.userId,
                        userTo: id
                    }, function(err) {
                        if (err) {
                            console.error(err);
                        }
                    });
                        if (!foundReport) {
                                var newReport = await new uReport(
                                    {
                                        userFrom: currentUser.userId,
                                        userTo: id,
                                        reportId: reportId,
                                        comments: comments,
                                        timeStamp: Date.now()
                                    }).save();
                                    if (newReport) {
                                        return true;
                                    }
                        } else {
                            throw new ApolloError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._alreadyReported : language.en._alreadyReported);
                        }
                }
                return false;
            } 
            else {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
        },
    }
};

module.exports = resolvers;