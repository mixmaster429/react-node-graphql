const {errors} = require("../../error");
const language = require("../../src/translations/api/lang.json");
const {AuthenticationError} = require("apollo-server");
const URL = process.env.URL;

const resolvers = {
    Query: {
        // query to get all blocked users
        getBlocked: async (root, args, {currentUser, bUser, user, req}) => {
            var {userId, adminUserId} = currentUser;
            var userList = await user.find({}, "userName profileImage");
            var blockedList;
                if (adminUserId) {
                    blockedList = await bUser.find({});
                    if (blockedList && blockedList.length) {
                        blockedList.forEach((r) => {
                            var uf = userList.find((u) => u.id == r.userFrom);
                            if (uf && uf.userName) {
                                r.fromName = uf.userName;
                            }
                            var ut = userList.find((u) => u.id == r.userTo);
                            if (ut && ut.userName) {
                                r.toName = ut.userName;
                            }
                        });
                        return blockedList;
                    }
                } else if (userId) {
                    blockedList = await bUser.find({userFrom: userId});
                    if (blockedList && blockedList.length) {
                        blockedList.forEach((r) => {
                            var ut = userList.find((u) => u.id == r.userTo);
                            if (ut && ut.userName) {
                                r.toName = ut.userName;
                                r.imageUrl = ut.profileImage ? 
                                (ut.profileImage.indexOf("graph.facebook.com") >=0 || ut.profileImage.indexOf("googleusercontent.com") >=0)
                                ? ut.profileImage : `${URL + req.headers.host}/fileStorage/uploads/users/${ut.id}/${ut.profileImage}`
                                : `${URL + req.headers.host}/fileStorage/static/default.png`;
                            }
                        });
                    }
                    return blockedList;
                } else {
                    throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
                }
        }
    },
    Mutation: {
        blockUser: async (root, {id}, {currentUser, bUser, chat, req}) => {
            let {userId} = currentUser;
            if (userId) {
                if (userId != id) {
                    var groupIds = [], groupNames = [];
                    var chatResult1 = await chat.find({userId: id, productUser: userId}, "groupId groupName");
                    var chatResult2 = await chat.find({userId: userId, productUser: id}, "groupId groupName");
                    var chatResult = chatResult1.concat(chatResult2);
                    if (chatResult && chatResult.length) {
                    chatResult.forEach((c) => {
                        groupIds.push(c.groupId);
                        groupNames.push(c.groupName);
                    }
                    );
                    }
                    var foundBlocked = await bUser.findOne({
                        userFrom: userId,
                        userTo: id
                    }, function(err) {
                        if (err) {
                            // console.error(err);
                        }
                    });
                    if (foundBlocked) {
                        var deleted = await bUser.remove({userFrom: userId, userTo: id}).setOptions({ single: true }).then(function (deleted) {
                            if (deleted) {
                                return !!deleted.n;
                            }
                        });
                        if (deleted) {
                            return {
                                groupIds,
                                groupNames,
                                status: "unBlocked"
                            };
                        }
                    } else {
                        var blockUser = await new bUser(
                            {
                                userFrom: userId,
                                userTo: id,
                                timeStamp: Date.now()
                            }).save();

                            if (blockUser) {
                                return {
                                    groupIds,
                                    groupNames,
                                    status: "blocked"
                                };
                            }
                        }
                }
            } else {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
        },
    }
};

module.exports = resolvers; 


