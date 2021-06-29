const { gql } = require("apollo-server-express");

//graphql schema for review

module.exports = gql`
type review {
    id: ID!
    userFrom: Int,
    imageUrl: String,
    fromName: String,
    userTo: Int,
    toName: String,
    ratings: Float
    comment: String,
    feedBack: [String],
    updatedAt: String,
    createdAt: String,
    timeAgo: String
}

input Review {
    userTo: Int
    comment: String
    feedBack: [String]
    ratings: Float
}

type reviewQuery {
    foundReview: review
    feedBack: feedbackTypes
}

type feedbackTypes {
    primaryLevel: [String]
    secondaryLevel: [String]
}

extend type Query {
    getReview (userId: Int): reviewQuery
    getReviews: [review]
}

extend type Mutation {
    updateReview (id: Int, data: Review): Boolean
}`;
