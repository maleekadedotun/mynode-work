const express = require("express")
const app = express()
const port = 4000
const morgan = require("morgan")
const mongoose = require("mongoose")
const productRoute = require("./routes/products")

//  use dotenv
require("dotenv/config")
const api = process.env.API_URL
console.log(api);

//middleware
app.use(express.json()) //body parser
app.use(morgan("tiny"))

//creating Model and Schema
const Product = require("./models/product");


// create a route
app.use(`${api}/products`, productRoute)

// connect to dataBase

mongoose.connect(process.env.CONNECTION_STRING)
.then(() => {
console.log("dataBase working successful");
})
.catch((err) => {
    console.log(err);
})

// create server

app.listen(port, () =>{
    console.log(`server is running on http://localhost: ${port} ${api}`);
})