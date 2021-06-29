
const {errors} = require("../../error");
const {ForbiddenError, AuthenticationError} = require("apollo-server");
const paginate = 20;
const URL = process.env.URL;


const resolvers = {
    Query: {


        getFeedBacks: async (root, args, {currentUser, feedBack}) => {
            if(currentUser) {
                const feedBacks1 = await feedBack.find({});
                return feedBacks1;
            }
            throw new AuthenticationError(errors.unauthorized);
        },
        
        //get a admin user details by id
        getFeedBack: async (root, {id}, {currentUser, feedBack}) => {

            if (currentUser) {
                const feedBackuser1 = await feedBack.findOne({_id: id});
                return feedBackuser1;
            }
            else {
                throw new ForbiddenError("FeedBack Not Found");
            }
        }
    },
    Mutation: {
        updateFeedBack: async (root, {data}, {currentUser, feedBack}) => {
            if (currentUser) {
                    var {id, status, email, userName, password} = data;
                    if(id){
                        var updatedFb = await feedBack.findOneAndUpdate({_id: id}, {$set: data}, {new: true}).then(function(fB){
                            if (fB) {
                                return true;
                            }
                        });
                    return updatedFb;
                } else {
                    // create new feedback
                    var resultInfo = await new feedBack(data).save();
                    if (resultInfo) {
                        return true;
                    }
                }
            }
            throw new AuthenticationError(errors.unauthorized);
        }
    }
};

module.exports = resolvers;