var { PubSub } = require("graphql-subscriptions");
var { withFilter } =require("graphql-subscriptions");
const {errors} = require("../../error");
const language = require("../../src/translations/api/lang.json");
const {ForbiddenError, AuthenticationError} = require("apollo-server");
const Message = require("../../schema/message/index");
var admin = require("firebase-admin");

const pubsub = new PubSub();
pubsub.ee.setMaxListeners(100);

// Details for push notifications for mobile
// var admin = require("firebase-admin");
// var serviceAccount = require("./passup-84d86-firebase-adminsdk-1q6qh-96d4a26a0a.json");
// console.log(serviceAccount)
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

const resolvers = {
  Query: {
    getRooms: async(_,args,{chat}) => {
        return await chat.find()
        .populate("message");
    },

    getRoombyId: async (root, { id },{chat}) => {
      return await chat.findById(id)
      .populate("message");
    },

    getMessages:async(root,  data,{chat,currentUser,message, user,product,req, bUser}) => {
      if(currentUser.userId){        
      var room = await chat.findOne({_id: data.id});
      var userInfo = await user.findOne({_id: room.productuserId});
      var productInfo = await product.findOne({_id: room.productId});
      fName = productInfo.language.filter((f) => f.langCode === req.headers.lang);
      if (fName.length === 0){                        
          fName = productInfo.language.filter((f) => f.langCode === "en");
      }
      fName.map(i => {          
        productTitle = i.title                      
      });

      // To find the block user
      var aib = await bUser.find({});     
      var newId;
      if (currentUser.userId == room.productuserId) {
          newId = room.userId;
      } else if (currentUser.userId == room.userId) {
          newId = room.productuserId;
      }
      var isBlocked = aib.find((ab) => ab.userFrom == currentUser.userId && ab.userTo == newId);
      var iB = (typeof(isBlocked) === "undefined") ? false : true;
      var BlockedBy = aib.find((ab) => ab.userTo == currentUser.userId && ab.userFrom == newId);
      var BB = (typeof(BlockedBy) === "undefined") ? false : true;

      const res = await message.find({room : data.id});

      // To find read message
      const readMessage = await message.update({$and: [{room : data.id}, {userId: {$ne: currentUser.userId}}]} , {$set: {readMessage : true}}, {multi: true});
      
      // Returning get messages details
      var roasterInfo =
      {
        message : res,
        isBlocked: iB,
        blockedBy: BB,
        blockUserId: room.userId,
        productuserImage: userInfo.profileImage ? (userInfo.profileImage.indexOf("graph.facebook.com") >=0 || userInfo.profileImage.indexOf("googleusercontent.com") >=0) ? 
          userInfo.profileImage : `${process.env.URL + req.headers.host}/fileStorage/uploads/users/${String(userInfo._id)}/${userInfo.profileImage}`
          : `${process.env.URL + req.headers.host}/fileStorage/static/default.png`,        
        productId: room.productId,
        productuserId: room.productuserId,
        productuserName: userInfo.userName,
        productImage: productInfo.images && productInfo.images.length ?
          `${process.env.URL + req.headers.host}/fileStorage/uploads/products/${String(productInfo._id)}/${productInfo.images[0]}` : "",                                
        rate: productInfo.rate,
        title: productTitle,
        isFree: productInfo.isFree,
        sellingStatus: productInfo.sellingStatus      
      };      
      return roasterInfo;
  }  else {
      throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
    }
},                       

    getMessageById: async (root, { id }) => {
        return await Message.findById(id)
        .populate("room");
      }
  },

  Mutation: {
    createRoom: async(root, data,{chat, currentUser, product, user, req, currency}) => {
       if(currentUser.userId){
        data.userId = currentUser.userId;
        var productUser = await product.findOne({_id: data.productId}, "userId");
        data.groupName = data.userId+"_"+data.productId+"_"+productUser.userId;
        var userInfo = await user.findOne({_id: productUser.userId});
        var productInfo = await product.findOne({_id: data.productId});
        var currencyInfo = await currency.findOne({code: productInfo.currencyCode});
  
        const foundgroupName = await chat.findOne({ groupName: data.groupName});
        if (foundgroupName) {
            var foundChat = {
            id: foundgroupName.id,
            userId: foundgroupName.userId,
            productId : foundgroupName.productId,
            productuserId : foundgroupName.productuserId,
            groupId : foundgroupName.id,
            groupName: foundgroupName.groupName,
            imageUrl: productInfo.images && productInfo.images.length ?
           `${process.env.URL + req.headers.host}/fileStorage/uploads/products/${String(productInfo._id)}/${productInfo.images[0]}` : "",
            profileUrl: userInfo.profileImage ? (userInfo.profileImage.indexOf("graph.facebook.com") >=0 || userInfo.profileImage.indexOf("googleusercontent.com") >=0) ? 
            userInfo.profileImage : `${process.env.URL + req.headers.host}/fileStorage/uploads/users/${String(userInfo._id)}/${userInfo.profileImage}`
            : `${process.env.URL + req.headers.host}/fileStorage/static/default.png`,
            sellingStatus: productInfo.sellingStatus === "SoldOut" ? 
            !!productInfo.isFree ? "Soldout" : "Soldout" : "ForSale",
            currencyCode: !productInfo.isFree ? productInfo.currencyCode : "",
            currencySymbol: !productInfo.isFree ? currencyInfo.symbol : "",
            rate: !productInfo.isFree  && productInfo.rate,
          };
          return foundChat;
        }
        else{
          // Saving chat room in dB
          var result = await new chat(data).save();

          //returning chat room details
          var roasterInfo ={
            id : result.id,
            userId: result.userId,
            productId : result.productId,
            productuserId : result.productuserId,
            groupId: result.id,
            groupName:result.groupName,
            imageUrl: productInfo.images && productInfo.images.length ?
            `${process.env.URL + req.headers.host}/fileStorage/uploads/products/${String(productInfo._id)}/${productInfo.images[0]}` : "",
            profileUrl: userInfo.profileImage ? (userInfo.profileImage.indexOf("graph.facebook.com") >=0 || userInfo.profileImage.indexOf("googleusercontent.com") >=0) ? 
            userInfo.profileImage : `${process.env.URL + req.headers.host}/fileStorage/uploads/users/${String(userInfo._id)}/${userInfo.profileImage}`
            : `${process.env.URL + req.headers.host}/fileStorage/static/default.png`,
            sellingStatus: productInfo.sellingStatus === "SoldOut" ? 
            !!productInfo.isFree ? "Soldout" : "Soldout" : "ForSale",
            currencyCode: !productInfo.isFree ? productInfo.currencyCode : "",
            currencySymbol: !productInfo.isFree ? currencyInfo.symbol : "",
            rate: !productInfo.isFree  && productInfo.rate,
            buyer: result.buyer,
            seller: result.seller
         };
          return roasterInfo;
      }
      }
      else {
        throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
      }
      },     

    sendMessage: async(root,  data,{chat, currentUser, message, user,product,currency,req, bUser, site}) => {

      if(currentUser.userId){       
        var room = await chat.findOne({_id: data.room});
        // to find block user
        var aib = await bUser.find({});
        var newId;
        if (currentUser.userId == room.productuserId) {
            newId = room.userId;
        } else if (currentUser.userId == room.userId) {
            newId = room.productuserId;
        }
        var isBlocked = aib.find((ab) => ab.userFrom == currentUser.userId && ab.userTo == newId);     
        var iB = (typeof(isBlocked) === "undefined") ? false : true;    
        var BlockedBy = aib.find((ab) => ab.userTo == currentUser.userId && ab.userFrom == newId);  
        var BB = (typeof(BlockedBy) === "undefined") ? false : true;   
        var userName = await user.findOne({_id: currentUser.userId});
        var productInfo = await product.findOne({$and:[{_id: room.productId} , {status: "Approved"}] });        
        if(productInfo){
        var currencyInfo = await currency.findOne({code: productInfo.currencyCode});
        }
        var userId = currentUser.userId;
        data.userId = userId;
        data.profileImage = userName.profileImage ? (userName.profileImage.indexOf("graph.facebook.com") >=0 || userName.profileImage.indexOf("googleusercontent.com") >=0) ? 
        userName.profileImage : `${process.env.URL + req.headers.host}/fileStorage/uploads/users/${String(userName._id)}/${userName.profileImage}`
          : `${process.env.URL + req.headers.host}/fileStorage/static/default.png`;

        // Finding device id for mobile
        var device;
        if (room.userId != currentUser.userId){
          device = await user.findOne({_id: room.userId});        
        }
        else{
          device = await user.findOne({_id: room.productuserId});          
        }

       // Saving message in dB
       if(iB === true && BB === true ) {             
            throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._isBlocked : language.en._isBlocked);
       } else if(BB === true) {       
            throw new ForbiddenError (typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._blockedBy : language.en._blockedBy);                 
       } else if (iB === true){
            throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._isBlocked : language.en._isBlocked);
       } else if (productInfo === null){
            throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._productnotFound : language.en._productnotFound);
       } else {
            var result = await new message(data).save();    
       }

       // Push notification for mobile      
       if(typeof(device.deviceId) !== "undefined") { 
        var roomData = data.room.toString();
        // const messaging = admin.messaging();
        if(device.device === "android") {
          var payload = {
            notification: null,
            data: {
              type: "chat",
              title: typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._messageTitle + " " + userName.userName : language.en._messageTitle + " " + userName.userName ,
              message: data.message,
              chat : roomData
            },                  
             token: device.deviceId
          };
          admin.messaging().send(payload)
          .then((result) => {
          //    console.log("result", result)
          })
          .catch((err) => {
            console.log("err", err);
            throw new Error(err); 
          });
        }

        if(device.device === "ios") {
          var payload = {
          notification: {
            title: typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._messageTitle + " " + userName.userName : language.en._messageTitle + " " + userName.userName ,
            body: data.message
          },
          data: {
            type: "chat",
            title: typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._messageTitle + " " + userName.userName : language.en._messageTitle + " " + userName.userName ,
            message: data.message,
            chat : roomData
          }
          };                       
         admin.messaging().sendToDevice(device.deviceId, payload)
         .then((result) => {
           // console.log("result", result)
          }).catch((err) => {
            //console.log("err", err);
            throw new Error(err); 
            });    
        }     
      }

        // Returning send message details
        var roasterInfo ={
          id : result.id,
          userId: data.userId,
          profileImage: data.profileImage,
          groupId: room._id,
          productId:room.productId,
          message : result.message,
          room : result.room,
          buyer: data.buyer,
          seller: data.seller,
          createdAt: result.createdAt,       
          imageUrl: productInfo.images && productInfo.images.length ?
         `${process.env.URL + req.headers.host}/fileStorage/uploads/products/${String(productInfo._id)}/${productInfo.images[0]}` : "",          
          sellingStatus: productInfo.sellingStatus === "SoldOut" ? 
          !!productInfo.isFree ? "Soldout" : "Soldout" : "ForSale",
          currencyCode: !productInfo.isFree ? productInfo.currencyCode : "",
          currencySymbol: !productInfo.isFree ? currencyInfo.symbol : "",
          rate: !productInfo.isFree  && productInfo.rate
      };
      // Subscription 
      pubsub.publish("messageAdded", { messageAdded: roasterInfo });
      var rosterUserId = newId;
      if (rosterUserId != currentUser.userId) {
        // var currentUser = { };
        // currentUser.userId = 10003;
        // let {chat, user, product, currentUser, req, bUser,message, currency, deleteChat} = params;
        var allUsers = await user.find({status: "Active"});
        var allProducts = await product.find({status: "Approved"});
        var allBlocked = await bUser.find({});
        var currencies = await currency.find({status: "Active"});
        var chatResult1 = await chat.find({productuserId: rosterUserId});
        var chatResult2 = await chat.find({userId: rosterUserId});  
        var chatResult = chatResult1.concat(chatResult2);
             
        var msg = await message.find({});
   
    chatResult.forEach(async(cr) => {                 
         var rosternewId;
         if (rosterUserId == cr.productuserId) {
              rosternewId = cr.userId;
          } else if (rosterUserId == cr.userId) {
              rosternewId = cr.productuserId;
          }
          var specUser = allUsers.find((au) => au.id == rosternewId);
          var specProduct = allProducts.find((ap) => ap.id == cr.productId);
          if (specUser && specProduct) {
              cr.userName = specUser.userName;
              cr.userId = specUser.id;
              var IsBlocked = allBlocked.find((ab) => ab.userFrom == rosterUserId && ab.userTo == specUser.id);
              var BlockedBy = allBlocked.find((ab) => ab.userTo == rosterUserId && ab.userFrom == specUser.id);
              if (IsBlocked) {
                cr.isBlocked = true;
              }
              if (BlockedBy) {
                cr.blockedBy = true;
              }
              
              cr.profileImage = specUser.profileImage ?
              (specUser.profileImage.indexOf("graph.facebook.com") >=0 || specUser.profileImage.indexOf("googleusercontent.com") >=0) ? 
              specUser.profileImage : `${process.env.URL + req.headers.host}/fileStorage/uploads/users/${String(specUser._id)}/${specUser.profileImage}`
              : `${process.env.URL+req.headers.host}/fileStorage/static/default.png`;
              if (cr.productuserId == rosterUserId) {
                cr.role = "seller";
              }
              else {
                cr.role = "buyer";
              }
              fName = specProduct.language.filter((f) => f.langCode === req.headers.lang);
              if (fName.length === 0){                        
                  fName = specProduct.language.filter((f) => f.langCode === "en");
              }
              fName.map((i) => {       
                  cr.productName = i.title;
              });


              var chosenCurrency = currencies.find(c => c.code == req.headers.currency);
              if (specProduct.currencyCode != req.headers.currency && specProduct.currencyCode != "") {
                var speCurr = currencies.find((c) => c.code == specProduct.currencyCode); 
                productConversionRate= (specProduct.rate / speCurr.rate).toFixed(2);
                cr.rate = (productConversionRate * chosenCurrency.rate).toFixed(2);
                cr.currencyCode = req.headers.currency;
                cr.currencySymbol = chosenCurrency.symbol;
              }
              else {
                cr.rate = (specProduct.rate).toFixed(2);
                cr.currencyCode = specProduct.currencyCode;
                var speCurr = currencies.find((c) => c.code == specProduct.currencyCode);      
                if (speCurr) {
                    cr.currencySymbol = speCurr.symbol;
                }
              }

              cr.sellingStatus = specProduct.sellingStatus === "SoldOut" ? 
              !!specProduct.isFree ? "SoldOut" : "Soldout" : "";
              if(specProduct.images && specProduct.images.length) {
                if (specProduct.images[0] == "") {                        
                    cr.image = await `${process.env.URL+req.headers.host}/fileStorage/static/defaultproduct.png`;
                }                            
                else {
                    cr.image = await `${process.env.URL+req.headers.host}/fileStorage/uploads/products/${String(specProduct._id)}/${specProduct.images[0]}`;   
                }
              }
              if(cr.id){
                    cr.groupId=cr.id;
              }
              var m = msg.filter((a) => a.room == cr.id);
              message = m.map( (item) => {
                      return item.createdAt;
                  });                           
              cr.lastseen = message[message.length - 1]                                          
              if (cr.lastseen == undefined){
                  cr.lastseen = cr.createdAt
              }

            var rM = msg.filter((a) => a.room == cr.id && a.userId != rosterUserId);                                                                 
            readMessage = rM.map((item) => {
              if((cr.id == item.room )&& (item.readMessage == false)){
                cr.message = item.message
                return item.readMessage;
              }
            });
            var filtered = readMessage.filter(function (el) {
                return el == false;
            });    

            cr.unreadMessage = filtered.length;                                                     
        }
        })

        const sorted = chatResult.sort((a, b) => {
            if ((a.lastseen && b.lastseen) != undefined){
            const aDate = a.lastseen;
            const bDate = b.lastseen;
            return bDate - aDate;
            }
            else if ((a.lastseen == undefined) && (b.lastseen != undefined)){
                const aDate = a.createdAt;
                const bDate = b.lastseen;
                return bDate - aDate;
            }
            else if ((b.lastseen == undefined) && (a.lastseen != undefined)){
                const aDate = a.lastseen;
                const bDate = b.createdAt;
                return bDate - aDate;
            }
            else if ((a.lastseen && b.lastseen) == undefined){
                const aDate = a.createdAt;
                const bDate = b.createdAt;
                return bDate - aDate;
            }
          })
      
          if(room.userId == currentUser.userId){
            sorted.userId = room.productuserId
          }else if(room.productuserId == currentUser.userId){
            sorted.userId = room.userId
          }
        // Subscription 
        sorted.type = "All";
        pubsub.publish('newrosterAdded', { newrosterAdded: sorted });

    }
      return roasterInfo;
    }
  }
  },

  // Subscription for message
  Subscription: {
    messageAdded: {
     subscribe: withFilter(() => pubsub.asyncIterator("messageAdded"), (payload, variables) => {
       // The `messageAdded` channel includes events for all channels, so we filter to only
        // pass through events for the channel specified in the query
        return payload.messageAdded.room === variables.chatroomId;
     }),      
    },
    newrosterAdded: {
      subscribe: withFilter(() => pubsub.asyncIterator('newrosterAdded'), (payload, variables) => {
         return payload.newrosterAdded.userId == variables.userId && payload.newrosterAdded.type === variables.type;
      }),     
     },
  },
 };
 module.exports = resolvers;
