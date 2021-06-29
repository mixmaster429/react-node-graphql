const { gql } = require("apollo-server-express");

//graphql schema for report reason

module.exports = gql`
type reason {
    id: ID!
    name: String,
    description: String,
    image: String,
    status: String,
    updatedAt: String,
    createdAt: String
}

type reasonlangTrans {
    langCode: String
    name: String
    description: String
}

type adminreason {
    id: ID!
    language: [reasonlangTrans]
    image: String,
    status: String,
    updatedAt: String,
    createdAt: String
}

input reasonlangTranslation{
    langCode: String
    name: String
    description: String
}

input Reason {
    language: [reasonlangTranslation]    
    image: Upload,
    status: String
}

extend type Query {
    getReason (reasonId: Int): adminreason
    getReasons: [reason]
    getAdminReasons: [adminreason]
}

extend type Mutation {
    updateReason (id: Int, data: Reason): Boolean
}`;
