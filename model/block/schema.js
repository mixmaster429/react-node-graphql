const { gql } = require("apollo-server-express");

//graphql schema for blocked user

module.exports = gql`
type blockUser {
    id: ID!
    userTo: Int,
    fromName: String,
    toName: String,
    imageUrl: String
    timeStamp: String
}

type blockResult {
    status: String,
    groupIds: [String]
    groupNames: [String]
}

extend type Query {
    getBlocked: [blockUser]
}

extend type Mutation {
    blockUser(id: Int): blockResult
}`;
