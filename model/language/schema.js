const { gql } = require("apollo-server-express");

module.exports = gql`

type languageList{
    id: ID
    name: String
    value: String
    status: String
    createdAt: String
    updatedAt: String
}

extend type Query {
    getLanguages: [languageList]
    getAdminLanguages: [languageList]
}

input languageInfo {
    name: String
    value: String
    status: String   
}

extend type Mutation {
    updateLanguage(id: Int, data: languageInfo): languageList
}`;