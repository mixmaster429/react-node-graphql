const { gql } = require("apollo-server-express");

//graphql schema for notification

module.exports = gql`

type notification {
    id: ID!
    type: String
    message: String
    timeAgo: String
    imageUrl: String
}

extend type Query {
    getNotifications: [notification]
}

input Notification {
     userFrom: Int
     userTo: Int
     type: String
}`;
