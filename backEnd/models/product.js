const express = require("express")
const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name : String,
    image: String,
    countInStock: Number
});

// create a model
const Product = mongoose.model("Product", productSchema)

module.exports = Product