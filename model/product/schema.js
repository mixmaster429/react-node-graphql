const { gql } = require("apollo-server-express");

//graphql schema for product

module.exports = gql`
scalar Upload
scalar Long

type categoryFieldData {
    fieldId: ID
    fieldName: String
    fieldParent: String
    fieldChild: ID
    rangeValue: ID
    inputTag: ID
    rangeMinValue: ID
    rangeMaxValue: ID
    fieldChildName: ID
}

type product {
    id: ID!
    userId: Int
    userName: String
    language: [langProd]    
    title: String!
    description: String
    isDeleted: Boolean
    deletedAt: String
    images: [String]
    categoryId: Int
    category: String
    viewers: [Int]
    location: location
    isFree: Boolean!
    createdAt: String
    updatedAt: String
    likedUsers: [Int]
    sellingStatus: String
    status: String
    year: Int
    rate: Float
    currencyCode: String
    currencySymbol: String
    userProfile: String
    timeAgo: String
    viewersCount: Int
    isFav: Boolean
    viewed: Boolean
    speedImage: String
    unit: String
    
    frequency: String
    chatType: String
    groupsId: String
    groupsName: String
    isNew: Boolean
    isBlocked: Boolean
    type: String
    sellingTimeStamp: String
    featured: Int
    featuredTransactionId: String
    featuredExpiry: String
    featuredName: String    
    featuredValidation: Int
    featuredDescription: String
    #ProductsCount: String
    categoryFieldsInfo: [categoryFieldData]
}

type langProd {
    langCode: String
    title: String!
    description: String
}

type adminProduct {
    id: ID!
    language: [langProd]    
    userId: Int
    userName: String
    isDeleted: Boolean
    deletedAt: String
    images: [String]
    categoryId: Int
    category: String
    viewers: [Int]
    location: location
    isFree: Boolean!
    createdAt: String
    updatedAt: String
    likedUsers: [Int]
    sellingStatus: String
    status: String
    year: Int
    rate: Float
    currencyCode: String
    currencySymbol: String
    userProfile: String
    timeAgo: String
    viewersCount: Int
    isFav: Boolean
    viewed: Boolean
    speedImage: String
    unit: String
    frequency: String
    chatType: String
    groupsId: String
    groupsName: String
    isNew: Boolean
    isBlocked: Boolean
    type: String
    sellingTimeStamp: String
    featured: Int
    featuredTransactionId: String
    featuredExpiry: String
    featuredName: String    
    featuredValidation: Int
    featuredDescription: String
    categoryFieldsInfo: [categoryFieldData]
    #ProductsCount: String
}

input FilterInput {
    title: String
    description: String
    categoryId: Int
    location: InputLocation
    rateFrom: Int
    rateTo: Int
    unit: String
    radius: String
    sortBy: Int
    dateBy: Int
    isFree: Boolean
    #fieldParent: [String]
    fieldChild: [ID]
    rangeFilter: [rangeFilterInput]    
}

input rangeFilterInput {
    fieldId: Int
    rangeFrom: Int
    rangeTo: Int
}

extend type Query {
    getProduct(id: Int, pageNumber: Int): [product]
    getAdminByProduct(id:Int): [adminProduct]
    getAllProducts(filter: FilterInput, pageNumber: String, deviceId: String, device: String): [product]
    getAllAdminProducts(filter: FilterInput):[adminProduct]
    getRoster(type: String): [Roster]
}

type Roster {
    userId: String
    groupId: String
    groupName: String
    isBlocked: Boolean
    blockedBy: Boolean
    userName: String
    profileImage: String
    role: String
    productName: String
    sellingStatus: String
    image: String
    productId: Int
    currencyCode: String
    currencySymbol: String
    rate: Float
    lastseen: String
    deleteChat: Boolean
    unreadMessage: Int
}

input langUpdateProd {
    langCode: String
    title: String!
    description: String
}

input ProductData {
    language: [langUpdateProd]
    title: String
    description: String
    images: [Upload]
    categoryId: Int
    category: String
    location: InputLocation
    isFree: Boolean
    userId: Int
    userName: String
    rate: Float
    currencyCode: String
    frequency: String
    unit: String
    mobileUploads: [String]
    deleteImages: [String]
    status: String
    sellingStatus: String
    featured: Int
    featuredTransactionId: String
    featuredExpiry: String
    featuredName: String
    featuredValidation: Int
    featuredDescription: String
    categoryFields: [categoryFieldInput]
}

input categoryFieldInput {
    fieldId: ID
    fieldParent: String
    fieldChild: ID
    rangeValue: ID
}

 input InputImage{
    base64: String
    status: Int
    name: String
 }

type string {
    result: String!
}

type viewers {
    result: Int
}
type chatResult {
    userId: Int
    groupId : String
    groupName: String
    userName: String
    imageUrl: String
    productName: String
    profileUrl: String
    sellingStatus: String
    productId: Int
    currencyCode: String
    currencySymbol: String
    rate: Float
}

input ChatData {
    groupId: String!
    productId: Int!
    groupName: String
}

type sellingUpdate {
    status: String!
    userInfo: [info]
}

type info {
    id: Int
    profileImage: String
    userName: String
}


extend type Mutation {
    updateProduct(id: Int, data: ProductData): adminProduct
    updateSellingStatus(id: Int!, sellingStatus: String!): sellingUpdate
    deleteProduct(id: Int!): string
    likesUpdate(id: Int!): string
    viewersUpdate(id: Int!): viewers
    updateChatGroup(data: ChatData): chatResult
    discardImages(toDiscard: [String], userId: Int): string
}`;
