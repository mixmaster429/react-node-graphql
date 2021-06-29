const {errors} = require("../../error");
var { AuthenticationError, ForbiddenError, UserInputError } = require("apollo-server");
const URL = process.env.URL;
const sendMailAction = require("../../mailtemp");
var kue = require("kue");

/*
var queue = kue.createQueue({
    redis: {
        host: "127.0.0.1",
        port: 6379
    }
});
*/


const resolvers = {
    Query: { },
    Mutation: {
        /*
        bulkMail: async (root, {data}, {currentUser, user, failedmail}) => {
            if (currentUser.adminUserId) {
                var userMail = await user.find();
                var mailAddress;
                var mailData = userMail.map((i) => {
                    return i.email;
                })
                if(data.userType === "specificUser") {
                   mailAddress = data.emailAddress;
                }
                else if(data.userType === "all") {
                   mailAddress = mailData;
                }
                
                var job = await  queue.create("email", {                    
                    to: mailAddress,
                    subject: data.subject,
                    html: data.content,
                })
                // .attempts(2)
                .removeOnComplete(true)
                .save();

                await queue.process("email", job.data.to.length, function(job, done){
                    var failedMails = [];
                    async function next(i) {                    
                        var mailAddr =  job.data.to[i];
                        sendMailAction.sendMail("bulkmail", job.data, mailAddr,(callback) => {    
                            // console.log("adminMail", callback)  
                            if(callback === false) {
                                failedMails.push(mailAddr);
                            }
                            if (i === job.data.to.length - 1) {
                                done();
                                if (failedMails.length > 0) {
                                    var queue1 = kue.createQueue({
                                        redis: {
                                            host: "127.0.0.1",
                                            port: 6379
                                        }
                                    });
                                    var job1 =  queue1.create("failedMail", {                    
                                        to: failedMails,
                                        subject: data.subject,
                                        html: data.content,
                                    })
                                    .removeOnComplete(true)
                                    .save();
                    
                                    queue1.process("failedMail", job1.data.to.length, function(job1, done1){
                                        var reAttemptFailedMails = [];
                                        async function next(j) {
                                            var mailAddr =  job1.data.to[j];
                                             sendMailAction.sendMail("bulkmail", job1.data, mailAddr,(callback) => {    
                                                // console.log("reAtt", callback)  
                                                if(callback === false) {
                                                    reAttemptFailedMails.push(mailAddr);
                                                }                                                
                                                if (j === job1.data.to.length - 1) {
                                                    done1();
                                                    if (reAttemptFailedMails.length > 0) {  
                                                        data.emailAddress = reAttemptFailedMails;
                                                        new failedmail(data).save();
                                                    }
                                                }
                                                else {
                                                    next(j + 1);
                                                }
                                            });                                                                
                                        }
                                        next(0);
                                    });
                                }
                            }
                            else {
                             next(i + 1);
                            }
                        });                        
                    }
                    next(0);
                });
                return true;
            } 
            else {
                throw new AuthenticationError(errors.unauthorized);
            }
        }
        */
    }
};

module.exports = resolvers;