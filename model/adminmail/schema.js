const { gql } = require("apollo-server-express");

//graphql schema for static Pages

module.exports = gql`

type bulkmailDetails {    
    emailAddress: [String],
    subject: String,
    content: String,    
}

input bulkmailInfo {
    userType: String
    emailAddress: [String],
    subject: String,
    content: String, 
}

extend type Mutation {
    bulkMail(data: bulkmailInfo): Boolean
}`;
