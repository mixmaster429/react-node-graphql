const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const autoIncrement = require("mongoose-auto-increment");
const Schema = mongoose.Schema;
autoIncrement.initialize(mongoose.connection);
// db schema - admin
const adminSchema = new Schema({
    userName : {        
        type: String,
        required: true,
        unique : true
    },
    password: {
        type: String,        
        required: function() {
            var result = this.faceBookId ? false : this.googleId ? false : this.appleId ? false : true ;
            return result;   
        }
    },
    role: {
        type: String,
        default: "Admin"
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {  
        type : Date,
        default : Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default:"Active"
    },
    faceBookId: {
        type: String
    },    
    googleId: {
        type: String
    },
    appleId:{
        type: String
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
});

adminSchema.pre("save", function(next) {
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

adminSchema.plugin(autoIncrement.plugin, {model: "admin", startAt: 10000});

module.exports = mongoose.model("admin", adminSchema);