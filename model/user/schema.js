const { gql } = require("apollo-server-express");

// graphql schema for user

module.exports = gql`
type User {
    id: ID!
    userName: String!
    password: String
    oldPassword: String
    newPassword: String
    bio: String
    profileImage: String
    email: String!
    currencyCode: String
    TimeZone: Int
    status: String
    conversationId: Int
    faceBookId: String
    googleId: String
    appleId: String
    deviceId: String
    blocked: [Int]
    favourites: [Int]
    faceBookVerified: Boolean
    googleVerified: Boolean
    phoneVerified: Boolean
    emailVerified: Boolean
    rememberToken: String
    phone: Int
    createdAt: String
    updatedAt: String
    location: location
    unit: String
    radius: String
    isBlocked: Boolean,
    userRating: Float
}

type location {
    city: String
    state: String
    country: String
    lat_lon: [Float]
    pincode: String,
    address: String
}

type result {
    userId: String!
    token: String!
    userName: String!
    profileImage: String
    status: String
    location: location
    currencyCode: String
    currencySymbol: String
}

type userProducts {
    foundUser: User
    ForSale: [product]
    SoldOut: [product]
    review: [review]
    favourites: [product]
}

type Query {
    getUserDetails(id: Int, pageNumber: Int, type: Int): userProducts
    getAllUsers: [User]
}

input UserInput {
     id: Int
     userName: String,
     email: String,
     bio: String,
     profileImage: String,
     password: String,
     oldPassword: String,
     newPassword: String,
     location: InputLocation,
     unit: String,
     radius: String,
     status: String,
     type: String
}

input InputLocation {
    city: String
    state: String
    country: String
    lat_lon: [Float]
    pincode: String
    address: String
}

input RatingInput {
    rating: Int
    comments: String
}

input SignupInput {
    userName: String!,
    email: String!,
    password: String!,
    profileImage: String,
    status: String,
    type: String
}

input SocialLogin {
    userName: String!,
    email: String,
    profileImage: String,
    faceBookId: String,
    googleId: String
    appleId: String
}

input ResetPasswordInput {
    token: String!
    password: String!
    confirmPassword: String!
  }

type data {
    result: result
    noEmail: Boolean
}


type Mutation {
    signup(data: SignupInput): data
    socialLogin(data: SocialLogin): data
    signin(email: String!, password: String!): data
    editProfile(data: UserInput): User
    forgotPassword(email: String!): string
    resetPassword(input: ResetPasswordInput): String

}`;
