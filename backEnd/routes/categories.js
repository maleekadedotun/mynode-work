const {Category} = require("../models/category");
const express = require("express");
const router = express.Router();

// get all categories
router.get("/", async (req, res)=>{
    const categoryList = await Category.find()
    if(!categoryList){
        res.status(500).json({success: false})
    }
    res.status(200).send(categoryList)
})

// get one category
router.get("/:categoryId", async (req, res)=>{
    const par  = req.params.categoryId;
    const category = await Category.findById(par)
    if(!category){
        res.status(500).json({message: "The category cannot be found"});
    }
    else{
        res.status(200).json(category)
    }
})

// Update one Category
router.put("/:categoryId", async (req, res)=>{
    const par  = req.params.categoryId;
    const category = await Category.findByIdAndUpdate(par, {
        name : req.body.name,
        icon : req.body.icon,
        color : req.body.color,
    }, {new : true});
    if(!category){
        res.status(400).json({message: "The category cannot be updated"});
    }
    else{
        res.status(200).json(category)
    }
})

// DELETE CATEGORY
router.delete("/:categoryId", async (req, res)=>{
   const par = req.params.categoryId;
    Category.findByIdAndDelete(par)
    .then((category) =>{
      return res.status(200).json({success: true, message: "Category deleted successful"})
    }) 
    .catch((err) => {
        return res.status(400).json({success: false, error: err});
    })
})



// create a category
router.post("/", async (req, res) => {
       let category = new Category({
        name : req.body.name,
        icon : req.body.icon,
        color : req.body.color,
    });
    category = await category.save();
    // check
    // return res.status(404).send("the category cannot be created")

    if(!category){
        return res.status(404).send("The category cannot be created")
    }else {
        return res.status(200).json(category)
    }
})


module.exports = router
