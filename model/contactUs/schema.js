const { gql } = require("apollo-server-express");

//graphql schema for delete chat

module.exports = gql`

  type contactUs {
    id: Int 
    name: String
    email: String 
    feedback: String
    timeStamp: String
  }

 extend type Query {
    getAllContactUs: [contactUs]       
  }

 extend type Mutation {
    addContactUs(name: String!, email: String!, feedback: String!): contactUs                       
  }
`;





