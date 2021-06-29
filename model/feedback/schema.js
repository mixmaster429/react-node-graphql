const { gql } = require("apollo-server-express");

//graphql schema for feedback

module.exports = gql`
type FeedBack {
    id: ID!
    name: String,
    description: String,
    feedbackType: String,
    status: String,
    updatedAt: String,
    createdAt: String
}

input feedInput { 
    id:Int,
    name: String,
    description: String,
    feedbackType: String,
    status: String
}

extend type Query {
    getFeedBack (id: Int): FeedBack
    getFeedBacks: [FeedBack]
}

extend type Mutation {
    updateFeedBack (data: feedInput): Boolean

}`;
