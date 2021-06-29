const { gql } = require("apollo-server-express");

//graphql schema for static Pages

module.exports = gql`

type staticPageDetails {
    id: ID
    title: String
    content: String
    url: String  
    status: String
    updatedAt: String 
    createdAt: String
}

type staticPageslangTrans {
    langCode: String
    title: String
    content: String
}

type adminStaticPageDetails {
    id: ID
    language: [staticPageslangTrans]
    url: String    
    status: String
    updatedAt: String 
    createdAt: String
}

extend type Query {
    getstaticPageDetails: [staticPageDetails]
    getAdminStaticPageDetails: [adminStaticPageDetails]
}

input staticPageslangTranslation {
    langCode: String
    title: String
    content: String
}

input staticPagesInfo {    
    language: [staticPageslangTranslation]
    url: String    
    status: String   
}

extend type Mutation {
    updateStaticPages(id: Int, data: staticPagesInfo): adminStaticPageDetails
}`;
