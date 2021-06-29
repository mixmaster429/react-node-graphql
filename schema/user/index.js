const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;
autoIncrement.initialize(mongoose.connection);

// db schema - user
const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: function() {
            var result = this.faceBookId ? false : this.googleId ? false : this.appleId ? false : true;
            return result;
          }
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String
    },
    profileImage: String,
    location: {
        city: {
            type: String
        },
        state: {
            type: String
        },        
        address: {
            type: String
        },
        country: {
            type: String
        },
        lat_lon: {
            type: [Number],
            index:"2d"
        },
        pincode: {
            type: String
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    currencyCode: {
        type: String
    },
    timeZone: {
        type: Number
    },
    status: {
        type: String,
        default: "Active"
    },    
    conversationId: {
        type: Number
    },    
    faceBookId: {
        type: String
    },    
    googleId: {
        type: String
    },    
    appleId:{
        type : String
    },   
    deviceId: {
        type: String
    },  
    device: {
        type: String
    },  
    phoneNumber: {
        type: Number
    },
    rememberToken: {
        type: String
    },        
    unit: { 
        type: String,
        default: "KM"
    },
    radius: {
        type: String
    },
    blocked: {
        type: Array
    },
    report: {
        reportedTo: {
            type: Number
        },
        reportedFrom: {
            type: Number
        },
        reasonId: {
            type: Number
        },
        reportedAt: {
            type: String
        },
        comments: {
            type: String
        }
    },
    favourites: {
        type: Array
    },
    verifications: {
        faceBook: {
            type: Boolean
        },
        google: {
            type: Boolean
        },
        phoneNumber: {
            type: Boolean
        },
        email: {
            type: Boolean
        }
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    ratings: [{
        userFrom: {
            type: Number
        },
        rating: {
            type: Number
        },
        comments: {
            type: String
        },
        timeStamp: {
            type: Date,
            default: Date.now
        }
    }]
});

userSchema.pre("save", function(next) {
    if (!this.isModified("password")) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }

        bcrypt.hash(this.password, salt, (err, hash) => {
            if(err) {
                return next(err);
            }
            this.password = hash;
            next();
        });
    });
});

userSchema.plugin(autoIncrement.plugin, {model: "user", startAt: 10000});

module.exports = mongoose.model("user", userSchema);