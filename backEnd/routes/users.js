const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


// List all user
router.get(`/`, async (req, res) => {

    const userList = await User.find().select(" -__v");
    if(!userList){
        res.status(500).json({success: false})
    }
    res.status(200).send(userList)
});

// Register user.

router.post(`/register`, async(req, res) =>{
    let user = new User({
    name : req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zipCode: req.body.zipCode,
    city: req.body.city,
    country: req.body.country,
    })

   user = await user.save();

   // check

   if(!user){
     return res.status(404).json({success: false})
   }
   return res.send(user)

})

// find one user

router.get(`/:id`, async (req, res) => {
    const parameter = req.params.id
    const user = await User.findById(parameter)

    if(!user){
        res.status(400).send("The user cannot be created")
    }
    res.status(200).send(user)
});

// update user

router.put(`/:id`, async (req, res) =>{
    const parameters = req.params.id

    if(!mongoose.isValidObjectId(parameters)){
        res.status(404).send("User cannot be found")
    }

    const user = await User.findByIdAndUpdate(
        parameters,
        {
            name: req.body.name,
            description: req.body.description,
            riichDescription: req.body.riichDescription,
            image: req.body.image,
            images: req.body.images,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        }, {user: true},
    );

    if(!user){
        res.status(404).send("User cannot be updated")
    }
    res.status(200).send(user)
})

// delete user

router.delete(`/:id`, async (req, res) => {
    const parameters = req.params.id
    const user = User.findByIdAndRemove(parameters)
    .then((category) =>{
        return res.status(200).json({success: true, message: "User is deleted successfully"});
    })
    .catch((err) =>{
        return res.status(400).json({success: false})
    });
});

// User login route

router.post("/login", async (req, res) => {
    // Using body-parser , we will use req.body (for email and password)
    const user = await User.findOne({email: req.body.email})
    // checking for user existence using email.

    if(!user){
        return res.status(500).json({msg: "The user could not be found"})
    }

    // Login user

    if (user && bcrypt.compareSync(req.body.password, user.password)) {
        const secret = process.env.secret;
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {
                expiresIn: "1d"
            }
        );
        return res.status(200).json({
            user: user.email,
            isAdmin: user.isAdmin,
            token: token,
        });
    }
    else{
        res.status(400).send("Wrong email and password")
    }
});

// count user

router.get("/get/count", async (req, res) => {
    const userCount = await User.countDocuments();
    if(!userCount){
        return res.status(404).send("Cannot get count")
    }
    else{
        return res.status(200).send({userCount: userCount})
    }
});

module.exports = router;