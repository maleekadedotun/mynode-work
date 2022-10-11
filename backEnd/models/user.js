const express = require("express")
const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
    name : {type: String},
    email: {type: String, require: true},
    password:{type: String, require: true},
    phone: {type: String, require: true},
    isAdmin: {type: Boolean, default: false},
    street: {type: String, default: ""},
    apartment: {type: String, default: ""},
    zipCode: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        default: ""
    },
});


userSchema.virtual("id").get(function (){
    return this._id.toHexString();
});

userSchema.set("toJson", {virtual: true});

 exports.User = mongoose.model("User", userSchema) // it accept two [parameter] one from the collection in the db and schema.

