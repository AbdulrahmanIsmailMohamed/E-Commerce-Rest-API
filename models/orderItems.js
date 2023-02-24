const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Product"
    }
});

orderItemSchema.virtual('id').get(function () {
    return this._id;
});

orderItemSchema.set('toJSON', {
    virtuals: true,
});

const OrderItem = mongoose.model("OrderItem", orderItemSchema);

module.exports = OrderItem