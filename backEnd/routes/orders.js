const express = require("express");
const router = express.Router();
const { Category } = require("../models/category");
const { OrderItem } = require("../models/orderItem");
const { Order } = require("../models/order");
const mongoose = require("mongoose");




// find all orders

router.get("/", async (req, res) => {
    // const orderList = await Order.find().populate("user", "phone", "status", "country").sort('dateOrdered'); // sortedin ascending order

    const orderList = await Order.find()
    .populate("user", "name email phone")
    .populate({
        path: "orderItems",
        populate: {
            path: "product",
            select: "name price",
            populate: {path: "category", select: "name"},
        },
    })
    .sort({dateOrdered: -1}); // Sorted descending order.
    if(!orderList){
        res.status(500).json({success: false});
    }
    res.status(200).send(orderList);
});

// create order
router.post("/", async (req, res) => {
    const orderItemsIds = Promise.all(
        req.body.orderItems.map(async (orderItem) => {
            let newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                product: orderItem.product,
            });
            newOrderItem = await newOrderItem.save();
            
            return newOrderItem._id;
        })
    );

    // console.log(orderItems);

    const orderItemsIdsResolved = await orderItemsIds; // resolved id
    // console.log(orderItemsIdsResolved);

    // Get totalPrice

    const totalPrices = await Promise.all(
        orderItemsIdsResolved.map(async (orderItemsId) => {
            const orderItem = await OrderItem.findById(orderItemsId).populate("product", "price");
            console.log(orderItem);
            const totalPrice = orderItem.quantity * orderItem.product.price;
            return totalPrice;
        })
    );

    const totalPrice = totalPrices.reduce((total, item) => total + item, 0)
    console.log(totalPrice);

    let order = new Order({
        // orderItems: req.body.orderItems,
        // orderItems: orderItemsIds,

        orderItems: orderItemsIdsResolved,
        shippingAddress1 :req.body.shippingAddress1,
        shippingAddress2 :req.body.shippingAddress2,
        city: req.body.city,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice:totalPrice,
        user: req.body.user,
        dateOrdered: req.body.dateOrdered,

    });
    order = await order.save();

    // Check
    if (!order) {
        return res.status(500).send("The category cannot be created.")
    }
    res.send(order);
});

// Find one order

router.get("/:id", async (req, res) => {
    const parameters = req.params.id
    const order = await Order.findById(parameters)
    .populate("user", "name email")
    .populate({
        path : "orderItems",
        populate: {
            path: "product",
            select: "name price",
            populate: {path: "category", select: "name"},
        },
    });

    if(!order) {
        res.status(500).send("Order cannot be found");
    }
    res.status(200).send(order);
});

// update order

router.put("/:id", async (req, res) => {
    const parameters = req.params.id;

    if(!mongoose.isValidObject(parameters)) {
        res.status(400).send("Invalid order id");
    }
    const order = await order.findByIdAndUpdate(
        parameters,
        {
            status: req.body.status
        },
        {
            new: true,
        },
    );
    if(!order) {
        res.status(500).send("order cannot be updated");
    }
    res.status(200).send(order);
});

// delete order

router.delete("/:id", (req, res) => {
    const parameters = req.params.id
    const order = Order.findByIdAndRemove(parameters)
    .then(async (order) => {
        if (order) {
            await order.orderItems;
            return res.status(200).json({success: true, message: "Order was deletd successfully"});
        }
    })
    .catch((err) => {
        return res.status(400).json({success: false, error: err});
    })
});


// totalSales of eshop
router.get('/get/totalsales', async (req, res) => {
    const totalSales = await Order.aggregate([
        {$group: {
            _id: null,
            totalsales:{
        $sum: "$totalPrice"
            }
        }}
    ])

    if(!totalSales) {
        return res.status(500).send("The order cannot be Generated")
    }

    res.send({totalSales: totalSales.pop().totalsales})
})

router.get("/get/count", async (req, res) => {
    const orderCount = await Order.countDocuments();
    if(!orderCount) {
         res.status(500).json({success: false});
    } else {
     res.send({orderCount: orderCount});
    }
});

router.get('/get/user-orders/:userid', async (req, res) => {

    const userOrderList = await Order.find({user: req.params.userid})
    .populate({
        path: 'orderItems',
        populate:{
            path: 'product',
            populate: {path: 'category'}
        }
    }).sort({'dateOrdered': -1})

    if (!userOrderList) {
        res.status(500).json({success: false})
    }
    res.status(200).send(userOrderList)
})

module.exports = router;