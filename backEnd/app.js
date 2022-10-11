const express = require("express");
const app = express();
const port = 4000;
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");


// create route
const productRoute = require("./routes/products");
const categoryRoute = require("./routes/categories");
const usersRoute = require("./routes/users");
const ordersRoute = require("./routes/orders")
const errorHandle = require("./helpers/error-handle");
const authJwt = require("./helpers/jwt");
// const ordersRoute = require("./routes/orders");


// cors enable
app.use(cors());
app.options("*", cors());


//  use dotenv
require("dotenv/config")
const api = process.env.API_URL
console.log(api);

//middleware
app.use(express.json()) //body parser
app.use(morgan("tiny"))
app.use(authJwt())
app.use(errorHandle)

//creating Model and Schema
const Product = require("./models/product");


// create a route
app.use(`${api}/products`, productRoute);
app.use(`${api}/categories`, categoryRoute);
app.use(`${api}/users`, usersRoute);
app.use(`${api}/orders`, ordersRoute);

// app.use(`${api}/orders`, ordersRoute);

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
    console.log(`server is running on http://localhost:${port}${api}`);
})