const { gql } = require("apollo-server-express");

//graphql schema for reported user

module.exports = gql`
type userReport {
    id: ID!
    fromName: String,
    toName: String,
    reportName: String,
    comments: String,
    timeStamp: String
}

extend type Query {
    getUserReports: [userReport]
}

extend type Mutation {
    updateUserReports(id: Int, reportId: Int, comments: String): Boolean
}`;
