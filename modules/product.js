const mongoose = require("mongoose");

const productSchema = mongoose.Schema({

});

const product = mongoose.model("product", productSchema);

module.exports = product;