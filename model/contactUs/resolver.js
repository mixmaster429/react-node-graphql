const {errors} = require("../../error");
const {AuthenticationError} = require("apollo-server");

const resolvers = {
  Query: {
    getAllContactUs: async(_,args,{contactUs}) => {
        return await contactUs.find();       
    },                        
  },

  Mutation: {
    addContactUs: async(root, data, {contactUs}) => {     
          var result = await new contactUs(data).save();
          // Returning contactUs details
            var contactUsInfo ={
                id : result._id,
                name: result.name,                                                        
                email: result.email, 
                feedback: result.feedback,                            
                timeStamp: result.timeStamp,                            
            };
             return contactUsInfo; 
    } 
  }      
 };
 module.exports = resolvers;
