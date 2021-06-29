const { gql } = require("apollo-server-express");

//graphql schema for delete chat

module.exports = gql`

  type deleteChat {
    id: Int 
    userFrom: Int
    userTo: Int 
    chatroomId: Int
    timeStamp: String
  }

 extend type Query {
  getDeletechat: [deleteChat]    
  }
 extend type Mutation {
    deleteChat(id: Int!): deleteChat                       
  }
`;





