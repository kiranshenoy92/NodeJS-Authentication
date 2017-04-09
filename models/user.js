var mongoose = require('mongoose');
var bCrypto = require('bcrypt-nodejs');
var userSchema = mongoose.Schema;

var User = new userSchema({
    firstName : {
        type: String,
        required: true
    },
    lastName : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    employeeID : {
        type: String,
        required: true,
        unique: true
    },
    active : {
        type: Boolean,
        required : true,
        default: false
    },
    token : {
        type : String,
        required : true
    },
    resetpwdtoken : {
        type : String
    }
})

User.methods.hashPassword = function(password) {
    return bCrypto.hashSync(password, bCrypto.genSaltSync(10), null);
}

User.methods.comparePassword = function (password) {
    return bCrypto.compareSync(password, this.password);
}


module.exports = mongoose.model('User',User);