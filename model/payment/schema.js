const { gql } = require("apollo-server-express");

//graphql schema for feedback

module.exports = gql`
type Pay{
    clientToken:String
    success: Boolean
}

type CreditCard{
    cardType:String
    maskedNumber:String
    cardholderName: String
}

type transDetails{
    id: String
    status: String
    amount: Float
    currencyIsoCode: String
    paymentInstrumentType: String
    creditCard: CreditCard    
    createdAt: String
    updatedAt: String   
}

type transactionList{
    id: String
    transactionId: String
    status: String
    amount: Float
    currencyIsoCode: String
    paymentInstrumentType: String
    cardType:String
    maskedNumber:String
    cardholderName: String 
    createdAt: Date
    updatedAt: Date
    success: Boolean
    productName: String
    productuserName: String
    currencySymbol: String
    paymentMethod: String
    payerEmail:String
    paymentId: String
}

type transaction {
    transaction: transDetails
    success: Boolean
}

input ChargePaymentMethodInput{
    amount: Float
    nonce: String  # Braintree , paypal
    productId: Int
    featuredId: Int
    tokenId: String # Stripe
    paymentMode: String
}

input tokenInput{
    featuredId: Int
}

type responseStripe{
    clientSecret: String 
}

extend type Query {
    getTransactionDetails: [transactionList]
}

extend type Mutation {
    createClientToken: Pay
    ChargePaymentMethod(data: ChargePaymentMethodInput): transaction
    createStripeClientToken(data: tokenInput): responseStripe
}
`;
