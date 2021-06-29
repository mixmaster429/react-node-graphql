const {ForbiddenError, AuthenticationError} = require("apollo-server");
const paginate = 20;
var braintree = require("braintree");
const language = require("../../src/translations/api/lang.json");
var Stripe = require("stripe");
var paypal = require('paypal-rest-sdk');

const resolvers = {
    Query: {
        getTransactionDetails: async (root, args, {currentUser, transaction, currency, site}) => {
            var transactionDetails = await transaction.find({});
            var siteData = await site.findOne({});
            var currencies = await currency.find();
                            
                transactionDetails.forEach(async function(res) { 
                    var conversionData = currencies.find((c) => c.code === siteData.defaultCurrency);
                    res.amount = (res.amount * conversionData.rate).toFixed(2);
                    res.currencyIsoCode = siteData.defaultCurrency;
                    var currencySym = currencies.find((c) => c.code === siteData.defaultCurrency);
                    res.currencySymbol = currencySym.symbol;                 
                });
                return transactionDetails;                                   
        },
    },

    Mutation: {
        createClientToken: async (root,args,{currentUser,site,req}) => {
            if (currentUser.userId) {
                try {
                    var siteinfo = await site.findOne({});                    
                    var gateway = braintree.connect({
                        environment: braintree.Environment[siteinfo.Environment],
                        merchantId: siteinfo.MerchantId,
                        publicKey: siteinfo.PublicKey,
                        privateKey: siteinfo.PrivateKey
                    });
                    let res = await gateway.clientToken.generate({});
                    return res;                                                                 
                }catch(error){
                    throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._paymentDenied : language.en._paymentDenied);
                }
            } else {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
        },
        createStripeClientToken: async (root, {data},{site,featured}) => {
            var stripekeyInfo = await site.findOne();
            var featuredlist = await featured.findOne({_id: data.featuredId});  
            var stripe = Stripe(stripekeyInfo.stripeSecretKey);
            var customer = await stripe.customers.create({
                name: 'Jenny Rosen',
                address: {
                  line1: '510 Townsend St',
                  postal_code: '98140',
                  city: 'San Francisco',
                  state: 'CA',
                  country: 'US',
                }
              });

            // const setup_intent =  await stripe.setupIntents.create({
            //     customer: customer.id,
            //   });
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Number((featuredlist.price * 100).toFixed(2)),
                currency: featuredlist.currencyCode,
                customer: customer.id,
                description: 'Software development services'
              });

                let paymentObject = {};
                paymentObject.clientSecret = paymentIntent.client_secret;
            
                return paymentObject;
        },
        ChargePaymentMethod: async(root,{data},{transaction,currentUser,site,product,user,currency, featured,req}) => {
            if(currentUser.userId) {
               try{   
                    // if(req.headers.currency != "USD") {
                    //     var featuredRate = await currency.findOne({code: req.headers.currency});  
                    //     featuredConversionAmount= (data.amount / featuredRate.rate).toFixed(2);
                    // }
                    // else {
                    //     featuredConversionAmount = data.amount;
                    // }

                    var productinfo = await product.findOne({_id: data.productId});
                    var userinfo = await user.findOne({_id: productinfo.userId});
                    var productTitle = productinfo.language.filter(x => x.langCode === "en").map(t=>{
                        return t.title
                    })
                    // Braintree
                    if(data.paymentMode === "Braintree") {
                        var siteinfo = await site.findOne({});
                        var gateway = braintree.connect({
                            environment: braintree.Environment[siteinfo.Environment],
                            merchantId: siteinfo.MerchantId,
                            publicKey: siteinfo.PublicKey,
                            privateKey: siteinfo.PrivateKey
                        });
                        var newTransaction = await gateway.transaction.sale(
                            {
                            amount: data.amount,
                            paymentMethodNonce: data.nonce,
                            options: {
                                submitForSettlement: true
                              }
                            } 
                        );
                        var currencyInfo = await currency.findOne({code: newTransaction.transaction.currencyIsoCode});
                        var transactions = await new transaction({
                            transactionId: newTransaction.transaction.id,
                            status: newTransaction.transaction.status,
                            amount: newTransaction.transaction.amount,
                            currencyIsoCode: newTransaction.transaction.currencyIsoCode,
                            paymentInstrumentType: newTransaction.transaction.paymentInstrumentType,
                            cardType: newTransaction.transaction.creditCard.cardType,
                            maskedNumber: newTransaction.transaction.creditCard.maskedNumber,
                            cardholderName: newTransaction.transaction.creditCard.cardholderName,
                            createdAt: newTransaction.transaction.createdAt,
                            updatedAt: newTransaction.transaction.updatedAt,
                            success: newTransaction.success,
                            productName: productTitle,
                            productuserName: userinfo.userName,
                            currencySymbol: currencyInfo.symbol,
                            paymentMethod: "Braintree"
                        }).save();

                        if (newTransaction.success === true){
                            var featuredlist = await featured.findOne({_id: data.featuredId});                             
                            var transTime = new Date((newTransaction.transaction.createdAt)).getTime();
                            var featuredExpiry = new Date(transTime + (featuredlist.validationPeriod * 60 * 60 * 1000));
                            var featuredDetails = await product.findOneAndUpdate({_id: data.productId}, {$set: { featuredTransactionId : newTransaction.transaction.id, featured: data.featuredId, featuredName: featuredlist.name, featuredValidation: featuredlist.validationPeriod, featuredExpiry: featuredExpiry, featuredDescription: featuredlist.description}});
                        }   
                        return newTransaction;
                    }

                    //Paypal
                    if(data.paymentMode === "Paypal") {
                        var siteinfo = await site.findOne({});
                        var gateway = braintree.connect({
                            accessToken: siteinfo.paypalAppId
                        });
                        var newTransaction = await gateway.transaction.sale(
                            {
                            amount: data.amount,
                            paymentMethodNonce: data.nonce,
                            options: {
                                submitForSettlement: true
                              }
                            } 
                        );
                        var currencyInfo = await currency.findOne({code: newTransaction.transaction.currencyIsoCode});
                        var transactions = await new transaction({
                            transactionId: newTransaction.transaction.id,
                            status: newTransaction.transaction.status,
                            amount: newTransaction.transaction.amount,
                            currencyIsoCode: newTransaction.transaction.currencyIsoCode,
                            paymentInstrumentType: newTransaction.transaction.paymentInstrumentType,
                            payerEmail: newTransaction.transaction.paypal.payerEmail,
                            paymentId: newTransaction.transaction.paypal.paymentId,
                            createdAt: newTransaction.transaction.createdAt,
                            updatedAt: newTransaction.transaction.updatedAt,
                            success: newTransaction.success,
                            productName: productTitle,
                            productuserName: userinfo.userName,
                            currencySymbol: currencyInfo.symbol,
                            paymentMethod: "Paypal"
                        }).save();
                        if (newTransaction.success === true){
                            var featuredlist = await featured.findOne({_id: data.featuredId});                             
                            var transTime = new Date((newTransaction.transaction.createdAt)).getTime();
                            var featuredExpiry = new Date(transTime + (featuredlist.validationPeriod * 60 * 60 * 1000));
                            var featuredDetails = await product.findOneAndUpdate({_id: data.productId}, {$set: { featuredTransactionId : newTransaction.transaction.id, featured: data.featuredId, featuredName: featuredlist.name, featuredValidation: featuredlist.validationPeriod, featuredExpiry: featuredExpiry, featuredDescription: featuredlist.description}});
                        }   
                        return newTransaction;
                    }

                    // Stripe payment
                    if (data.paymentMode === "Stripe") {
                        var stripeInfo = {
                            success : true,
                            transaction : {
                                amount : data.amount
                            }
                        };
                        await new transaction({
                            transactionId: data.tokenId,
                            amount: data.amount,
                            productName: productTitle,
                            productuserName: userinfo.userName,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            paymentMethod: "Stripe"
                        }).save();
                        var featuredlist = await featured.findOne({_id: data.featuredId});                   
                        var transTime = new Date().getTime();
                        var featuredExpiry = new Date(transTime + (featuredlist.validationPeriod * 60 * 60 * 1000));
                        var featuredDetails = await product.findOneAndUpdate({_id: data.productId}, {$set: { featuredTransactionId : data.tokenId, featured: data.featuredId, featuredName: featuredlist.name, featuredValidation: featuredlist.validationPeriod, featuredExpiry: featuredExpiry, featuredDescription: featuredlist.description}});
                        return stripeInfo;
                    }

                    // Paypal
                    // if (data.paymentID) {
                    //         var paypalInfo = {
                    //             success : true,
                    //             transaction : {
                    //                 amount : data.amount,
                    //                 id: data.paymentID
                    //             }
                    //         };                            
                    //           await new transaction({
                    //             transactionId: data.paymentID,
                    //             amount: data.amount,
                    //             success: true,
                    //             productName: productTitle,
                    //             productuserName: userinfo.userName,
                    //             createdAt: new Date().toISOString(),
                    //             updatedAt: new Date().toISOString(),
                    //             paymentMethod: "Paypal"
                    //         }).save();
                    //             featuredlist = await featured.findOne({_id: data.featuredId});                   
                    //             transTime = new Date().getTime();
                    //             featuredExpiry = new Date(transTime + (featuredlist.validationPeriod * 60 * 60 * 1000));
                    //             featuredDetails = await product.findOneAndUpdate({_id: data.productId}, {$set: { featuredTransactionId : data.paymentID, featured: data.featuredId, featuredName: featuredlist.name, featuredValidation: featuredlist.validationPeriod, featuredExpiry: featuredExpiry, featuredDescription: featuredlist.description}});

                    //         // paypal.configure({
                    //         //     'mode': 'sandbox', 
                    //         //     'client_id': 'AV1HpdhjmnA25Dmf24PTvGvygrUyFBZfpAevPD9JnzkO3-un64eEFSROI_t1gDUUHiyyzzRvFeHG9ZUk',
                    //         //     'client_secret': 'EMmenMl9ALnJ1nVZCQBfMwgiARoLT2Xqi1NM2Yquqxdks6RBJ3M_rurWQTnJ7G6Jm6ZwIycA6Y-VARs4'
                    //         //   });
                              
                    //         // paypal.payment.get(data.paymentID, async function (error, payment) {
                    //         //         if(payment){
                    //         //             console.log(payment)
                    //         //         } 
                    //         //         else{
                    //         //             throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._paymentLater : language.en._paymentLater);
                    //         //         }
                    //         // });
                    //         return paypalInfo;
                    // }
                }catch(error){
                    throw new ForbiddenError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._paymentLater : language.en._paymentLater);
                }
            }
            else {
                throw new AuthenticationError(typeof(language[req.headers.lang]) !== "undefined" ? language[req.headers.lang]._unauthorized : language.en._unauthorized);
            }
        },                
    }
};

module.exports = resolvers;