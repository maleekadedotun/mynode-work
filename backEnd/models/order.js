const mongoose = require("mongoose");

// creating orderSchema...............................

const orderSchema = mongoose.Schema({
    orderItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: "OrderItem"
        },
    ],
    shippingAddress1: {type: String, require: true},
    shippingAddress2: {type: String, require: true},
    
    city: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        require: true,
    },
    status: {
        type: String,
        require: true,
        default: "pending",
    },
    totalPrice: {
        type: Number,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User",
    },
    dateOrdered: {
        type: Date,
        default: Date.now,
    },

});

// Virtual to correct db id
orderSchema.virtual("id").get(function () {
    return this._id.toHexString();
});
orderSchema.set("toJSON", {virtual: true});

exports.Order = mongoose.model("Order", orderSchema);