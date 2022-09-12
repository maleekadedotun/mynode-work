const express = require("express")
const router = express.Router();

// list all Product Router 
router.get(`/`, async (req, res)=> {
    // res.send("hello api")
    const productList = await Product.find();
    if (!productList) {
        res.status(500).json({message : err})
    } else{
        res.send(productList)
    }
})

// create a newProduct Router
router.post(`/`, (req, res) =>{
    // const newProduct = req.body
    // console.log(newProduct);
    // res.send(newProduct)

    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock
    });
    // save the product
    product.save().then((createdProduct) =>{
        return res.status(201).json(createdProduct)
    }).catch((err) => {
         return res.status(500).json({
            error: err,
            success: false
         })
    })
})

module.exports = router