const { gql } = require("apollo-server-express");

//graphql schema for reported product

module.exports = gql`
type productReport {
    id: ID!
    user: String
    productId: Int
    productName: String
    productUser: String
    comments: String
    timeStamp: String
}

extend type Query {
    getReportedProducts: [productReport]
}

extend type Mutation {
    updateProductReports(productId: Int, comments: String): Boolean
}`;
