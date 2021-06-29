const { gql } = require("apollo-server-express");

//graphql schema for filters

module.exports = gql`

type valuesData {
    valueParent: String
    valueChild: [String]
}

type updatevaluesData {
    valueParent: String
    valueChild: [valueChildData]
}

type valueChildData {
    valueChildData: String
}

type filterInfo {
    id: ID
    name: String
    values: [valuesData]
    inputTag: String
    status: String
    min: Int
    max: Int
    updatedAt: String 
    createdAt: String
}

type fiterlang {
    langCode: String
    name: String
    values: [valuesData]
}

type updatefiterlang {
    langCode: String
    name: String
    values: [updatevaluesData]
}

type allfilterData {
    id: ID
    language: [fiterlang]
    min: Int
    max: Int
    inputTag: String
    status: String
    updatedAt: String 
    createdAt: String
}

type updatefilterData {
    id: ID
    language: [updatefiterlang]
    min: Int
    max: Int
    inputTag: String
    status: String
    updatedAt: String 
    createdAt: String
}

input valuesInputInfo {
    valueParent: String
    valueChild: [String]
}

input fiterInputlanguage {
    langCode: String
    name: String
    values: [valuesInputInfo]
}

input filterInput {
    language: [fiterInputlanguage]
    min: Int
    max: Int
    inputTag: String
    status: String
}

extend type Query {
    getFilters: [filterInfo]
    getAdminFilter: [allfilterData]
}

extend type Mutation {
    updateFilter(id: Int, data: filterInput) : updatefilterData
}

`;