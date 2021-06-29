const { gql } = require("apollo-server-express");

/* graphql schema for category, currency, country,... */

module.exports = gql`

type fieldData {
    filterId: Int
    name: String
    values: [filtervaluesData]
    min: Int
    max: Int
    inputTag: String
    isMandatory: Int
}

type filtervaluesData {
    valueParentId: ID
    valueParent: String
    valueChild: [valuesChildInfo]
}

type valuesChildInfo {
    valueChildId: ID
    valueChildData: String
}

type admincategory {
    id: ID
    language: [langTrans]    
    image: String
    createdAt: String
    updatedAt: String
    status: String
    isFeatured: Boolean
    fields: [fieldData]  
    allIsMandatory: [Int]
    allFilterId: [Int]
}

type category {
    id: ID
    name: String
    description: String
    image: String
    createdAt: String
    updatedAt: String
    status: String
    isFeatured: Boolean
    fields: [fieldData]
}

type langTrans {
    langCode: String
    name: String
    description: String
}

input langTranslation {
    langCode: String
    name: String
    description: String
}

type country {
    id: ID
    shortName: String
    longName: String
    iso3: String
    phoneCode: String
    numberCode: String
    createdAt: String
    updatedAt: String
}

type currency {
    id: ID
    name: String
    code: String
    symbol: String
    rate: Float
    status: String
    default: Boolean
    createdAt: String
    updatedAt: String
}

type timezone {
    id: ID
    name: String
    value: String
    createdAt: String
    updatedAt: String
}

type categoryInfo {
    category: [category]
    frequency: [String]
    currencyCode: String
    currencySymbol: String
    unreadMessage: Int
    adBannerDetails: [adBannerInfo]
}

type report {
    id: ID
    imageUrl: String
    reportName: String
    updatedDate: String
    createdAt: String
}

type featured {
    featuredInfo: [featuredData]
    paymentInfo: [featuredPaymentInfo]
}

type featuredData {
    id: ID
    name: String 
    image: String  
    description: String
    price: Float
    currencyCode: String
    currencySymbol: String
    status: String
    validationPeriod: Int
    updatedAt: String 
    createdAt: String
    beforeconversionMsg: String
    afterconversionMsg: String
}

type featuredPaymentInfo {
    payment_type: String
    value: String
    icon: String
    key: String
    mode: String
}

type featuredlangTrans {
    langCode: String
    name: String
    description: String
}

type adminfeatured {
    id: ID
    language: [featuredlangTrans]
    image: String  
    price: Float
    currencyCode: String
    currencySymbol: String
    status: String
    validationPeriod: Int
    updatedAt: String 
    createdAt: String
}

extend type Query {
    getCategoryDetails(fetch: String): categoryInfo
    getAdminCategoryDetails: [admincategory]
    getAdminCategorybyId(id: Int): admincategory
    getCurrencies(fetch: String): [currency]
    getCurrency(id: Int): currency
    getCountries: country
    getTimezone: timezone
    getReportOptions: [report]
    getFeaturedDetails: featured
    getAdminFeaturedDetails: [adminfeatured]
}

input fieldsInput {
    filterId: Int
    isMandatory: Int
}

input CategoryInfo {
    language: [langTranslation] 
    status: String     
    image: Upload
    createdAt: String
    updatedAt: String
    isFeatured: Boolean
    #fields: [fieldsInput]
    allIsMandatory: [Int]
    allFilterId: [Int]
}

input CurrencyInfo {
    name: String
    code: String
    symbol: String
    rate: Float
    status: String
} 

input featuredlangTranslation {
    langCode: String
    name: String
    description: String
}

input featuredInfo {
    language: [featuredlangTranslation]  
    image: Upload
    price: Float
    currencyCode: String
    status: String  
    validationPeriod: Int
}

extend type Mutation {
    updateCategory(id: Int data: CategoryInfo): Boolean
    updateCurrency(id: Int, data: CurrencyInfo): Boolean
    updateFeatured(id: Int, data: featuredInfo): adminfeatured
}`;
