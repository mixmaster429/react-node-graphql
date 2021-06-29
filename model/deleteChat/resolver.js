
const {errors} = require("../../error");
const {AuthenticationError} = require("apollo-server");
const URL = process.env.URL;

const resolvers = {
    Query: {
        getDeletechat: async(_,args,{deleteChat}) => {
            return await deleteChat.find();          
        },
    },
    Mutation: {
        deleteChat: async (root, {id}, {currentUser, deleteChat, chat}) => {           
            // if (currentUser.userId) {                     
            //           const room = await chat.findOne({_id: id});                       
            //           if(room){                          
            //             var newId;
            //             if (currentUser.userId == room.productuserId) {                            
            //                  newId = room.userId;
            //             } else if (currentUser.userId == room.userId) {                            
            //                  newId = room.productuserId;
            //             }
            //             const deletechatroom = await deleteChat.findOne({chatroomId: id});
            //             if(deletechatroom == null) {
            //                 var deleteChats = await new deleteChat(
            //                     {
            //                         userFrom: currentUser.userId,
            //                         userTo: newId,
            //                         chatroomId: id,
            //                         timeStamp: Date.now()
            //                     }).save(); 
            //             } else {
            //                 throw "already deleted";
            //             }
                                                
            //          // Returning delete chat details
            //             var deletechatInfo ={
            //                 id : deleteChats._id,
            //                 userFrom: deleteChats.userFrom,                                                        
            //                 userTo: deleteChats.userTo,
            //                 chatroomId: deleteChats.chatroomId,
            //                 timeStamp: deleteChats.timeStamp,                            
            //             };
            //              return deletechatInfo;                                               
            //           } else {
            //               throw "roomId is not found";
            //           }
            // } else {
            //     throw new AuthenticationError(errors.unauthorized);
            // }
        },
    }
};

module.exports = resolvers; 


