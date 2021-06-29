const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;

// db schema - product
const productSchema = new Schema({
    language: [{
        langCode: {
            type: String,
            default: "en"
        },
        title: {
            type: String
        },
        description: {
            type: String
        }
    }],
    userId: {
        type: Number
    },        
    images: Array,
    categoryId: {
        type: Number
    },
    category: String,
    viewers: {
        type: Array
    },
    location: {
        city: {
            type: String
        },
        state: {
            type: String
        },
        country: {
            type: String
        },
        lat_lon: {
            type: [Number],
            index:"2dsphere"
        },
        address: {
            type: String
        },
        pincode: {
            type: String
        }
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    },
    isFree: {
        type: Boolean
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    likedUsers: {
        type: Array
    },
    sellingStatus: {
        type: String,
        default: "ForSale"
    },
    status: {
        type: String,
        default: "Approved"
    },
    rate: {
        type: Number
    },
    currencyCode: {
        type: String
    },
    // frequency: {
    //     type: String
    // },
    sellingTimeStamp: Date,
    featured: Number,
    featuredTransactionId: String,
    featuredName: String,
    featuredValidation: Number,
    featuredExpiry: Date,
    featuredDescription: String,
    categoryFields: [{
        fieldId: Schema.Types.Mixed,        
        fieldParent: Schema.Types.Mixed,
        fieldChild: Schema.Types.Mixed,        
        rangeValue: Number
    }]
});

productSchema.plugin(autoIncrement.plugin, {model: "product", startAt: 10000});

module.exports = mongoose.model("product", productSchema);




// db.products.find(
//     {
//       "location.lat_lon":
//         { $near :
//            {
//              $geometry: { type: "Point",  coordinates: [9.9252007, 78.1197754] },
//              $maxDistance: 5000
//            }
//         }
//     }, "location.lat_lon"
//  )
