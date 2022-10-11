const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Create product schema and model.
const { Category } = require("../models/category");
// const { Order } = require("../models/order");
const { Product } = require("../models/product")
// const Category = require("../models/category")

const multer = require("multer") // for multer


const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',

}
// multer configuration

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        const isValid = imageFileType[file.mimetype];
        let uploadError = new Error("Invalid Image Type");
        if(isValid) {
            uploadError = null;
        }
        cb(uploadError, "public/uploads")
    },
    filename: function (req, res, cb) {
        const filename = file.originalname.replace(" ", "-");
        //  cb(null, filename + "-" + Date.now());
       const extension = FILE_TYPE_MAP[file.mimetype]
        cb(null, `${filename}-${Date.now()}.${extension}`);
    }
});
const uploadOptions = multer({storage: storage});
// Multer Ends


// list all Product Router 

// get product based on category
// http://localhost:4000/api/v1/product?=categoryId

router.get(`/`, async (req, res) => {

    let filter = {}

    if(req.query.categories){
        filter = {category: req.query.categories.split(",")}
        console.log(filter);
    }
    // res.send("hello api")
    const productList = await Product.find(filter).populate("category");
    if (!productList) {
        res.status(500).json({message : err})
    } else{
        res.send(productList)
    }
});

// get a single product

router.get(`/:id`, async (req, res)=> {
    // res.send("hello api")
const par = req.params.id
    const product = await Product.findById(par).select("name price").populate("category");
    if (!product) {
        res.status(500).json({message : err})
    } else{
        res.send(product)
    }
});

// create a newProduct Router
router.post(`/`, uploadOptions.single("image"), async (req, res) => {
 const file = req.file
 console.log("mmmmmmm", file);

   if (!file) {
       return res.status(400).send("No image in the request")
    }
    
    // Uploading Image
     const fileName = req.file.filename;
     console.log(fileName);
    const sourcePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
     console.log(sourcePath);


    // Validate Category first
    const category = await Category.findById(req.body.category)
    if(!category){
        return res.status(400).send("Invalid category")
    }

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${sourcePath}${fileName}`,
        // images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    });
    // save the product
    product = await product.save()

    if(!product){
        return res.status(500).send("The product cannot be created")
    }
    return res.send(product)

});

// update products

router.put("/:id", uploadOptions.single("image"), async (req, res) =>{
    const par = req.params.id;

    if(!mongoose.isValidObjectId(par)){
        res.status(400).send("Invalid product id")
    }

    const category = await Category.findById(req.body.category)
    if(!category){
        res.status(400).send("Invalid Category")
    }

    // const product = await Product.findByIdAndUpdate(par);
    // if (product) {
        
    // }
    const uploadProduct = await Product.findByIdAndUpdate(par,{
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        inFeatured: req.body.inFeatured,
    }, {new: true})

    if(!uploadProduct){
        res.status(400).json("product cannot be updated")
    }
    res.send(uploadProduct)
});

// Delete product

router.delete("/:id", (req, res) => {
    const par = req.params.id;
    Product.findByIdAndRemove(par).then(product =>{
        if(Product){
            res.status(200).json({success: true, message :  "The product deleted successfully"})
        }
        else{
            res.status(400).json({success: false, message: "Product could not be found"})
        }
    })
    .catch((err) =>{
        return res.status(404).json({success: false, error: err})
    })
});

// // count product
router.get("/get/count", async (req, res) => {
    const productCount = await Product.countDocuments();
    if(!productCount) {
         res.status(500).json({success: false});
    } else {
     res.send({productCount: productCount});
    }
});

// // featuredproduct

router.get(`/get/featured/:count?`, async (req, res) =>{
    const count = req.params.count ? req.params.count : 0
    console.log(count);

    const featuredProduct = await Product.find({isFeatured : true}).limit(+count);

    if(!featuredProduct) {
        return res.status(500).send({success: false})
    }
    return res.send(featuredProduct)
});



module.exports = router