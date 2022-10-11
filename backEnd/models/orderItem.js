const mongoose = require("mongoose");

// Creating category schema..............

const orderItemsSchema = mongoose.Schema({
    quantity: {type: Number, require: true},
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
});

// Virtual to correct db id
orderItemsSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

orderItemsSchema.set("toJSON", { virtuals: true});

// Create product model..............

exports.OrderItem = mongoose.model("OrderItem", orderItemsSchema);
// it accept two [parameters] one from the collection in the db and schema.