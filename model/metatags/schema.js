const { gql } = require("apollo-server-express");

//graphql schema for meta tags

module.exports = gql`

type metatagslangTrans {
    langCode: String
    pageTitle: String
    metaDescription: String
    keywords: String
}

type adminMetatags {
    id: ID
    language: [metatagslangTrans]
    pageUrl: String        
    updatedAt: String 
    createdAt: String
}

type metatags {
    id: ID
    pageTitle: String
    metaDescription: String
    keywords: String
    pageUrl: String  
    updatedAt: String 
    createdAt: String
}

extend type Query {
    getAdminMetatags: [adminMetatags]
    getMetatags: [metatags]
}

input metatagslangTranslation {
    langCode: String
    pageTitle: String
    metaDescription: String
    keywords: String
}

input metatagsInfo {    
    language: [metatagslangTranslation]
    pageUrl: String         
}

extend type Mutation {
    updateMetatags(id: Int, data: metatagsInfo): adminMetatags
}`;
