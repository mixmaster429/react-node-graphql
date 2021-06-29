const {errors} = require("../../error");
const language = require("../../src/translations/api/lang.json");
const {AuthenticationError} = require("apollo-server");
const {dateAdd} = require("../../handler");
const URL = process.env.URL;


const resolvers = {
    Query: {
        // api to get notifications for a user
        getNotifications: async (root, args, params) => {
            // var {currentUser, notification, user, req} = params;
            // var {userId} = currentUser;
            // if (userId) {
            //     var fetchNotifications = await notification.find({userTo: userId});
            //     var users = await user.find({});
            //     fetchNotifications.forEach((fn) => {
            //         var cUser = users.find((u) => u._id == fn.userFrom);
            //         switch (fn.type) {
            //             case "review": 
            //                 fn.message = `${cUser.userName} ${ typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._reviewMessage : language.en._reviewMessage}`;
            //                 fn.imageUrl = cUser.profileImage
            //                  ? (cUser.profileImage.indexOf("graph.facebook.com") >=0 || cUser.profileImage.indexOf("googleusercontent.com") >=0)
            //                  ? ut.profileImage : `${URL+req.headers.host}/fileStorage/uploads/users/${String(cUser._id)}/${cUser.profileImage}`
            //                  : `${URL + req.headers.host}/fileStorage/static/default.png`;
            //                 fn.timeAgo = dateAdd(fn.updatedAt, "short");
            //                 break;
            //         }
            //     });
            //     return fetchNotifications;
            // } else {
            //     throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            // }
        }
    },
    Mutation: {}
};

module.exports = resolvers; 




