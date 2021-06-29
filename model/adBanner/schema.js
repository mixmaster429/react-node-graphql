const { gql } = require("apollo-server-express");

//graphql schema for site setting

module.exports = gql`
type adBannerInfo {
    id: ID
    name: String
    webBannerImage: String
    mobileBannerImage: String
    bannerUrl: String
    status: String
    updatedAt: String 
    createdAt: String
}

extend type Query {
    getAdBannerInfo: [adBannerInfo]
}

input adBannerInput {
    name: String
    webBannerImage: Upload
    mobileBannerImage: Upload
    bannerUrl: String
    status: String
}

extend type Mutation {
    updateAdBanner(id: Int,data: adBannerInput): adBannerInfo
}`;
