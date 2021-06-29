const {site} = require("./dbSchema");
var admin = require("firebase-admin");

module.exports = {
 callPushnotification : async function() {
    var siteDetails =  await site.findOne({});
    var serviceAccount = require(`./fileStorage/uploads/firebase/firebaseJson/${siteDetails.firebaseJson}`);
    
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),    
      });
    }
    catch(err) {
      if (err.errorInfo) {
        console.log("Your firebase credentials are not valid, Upload a valid firebase JSON file");
      }
    } 
  }
};