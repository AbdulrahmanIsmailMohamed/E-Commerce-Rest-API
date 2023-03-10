const Product = require("../models/product");
const asyncWrapper = require("../middleware/async");
const Category = require("../models/category");
const mongoose = require("mongoose");

// idparams
const idParam = (req, res, nxt, val) => {
    if (/^[0-9a-fA-F]{24}$/.test(val)) {
        req.id = val;
        nxt();
    } else {
        res.send("id isn't a number :)");
    }
}

// localhost:3000/api/v1/products?categories:32156,32546
const getAllProducts = asyncWrapper(async (req, res, nxt) => {
    let filter = {};
    if (req.query.categories) {
        filter = { category: req.query.categories.split(",") }
    }
    const products = await Product.find(filter).populate("category");
    if (!products) return res.status(500).json({ success: false, message: "Not Found Products" });
    res.json(products);
});

const createProduct = asyncWrapper(async (req, res, nxt) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("Not Valide");

    // multer
    const file = req.file;
    if (!file) return res.status(400).send('No image in the request')
    const fileName = file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    delete req.body.image
    let image = `${basePath}${fileName}` // "http://localhost:3000/public/upload/image-2323232"

    const product = await Product.create({ ...req.body, image: image });
    if (!product) return res.status(400).send("the Product can't be created");
    res.status(201).send(product);
});

const deleteProduct = asyncWrapper(async (req, res, nxt) => {
    const products = await Product.findByIdAndRemove(req.params.id);
    if (!products) return res.status(404).json({ success: false, message: "the product Not Found" })
    res.json({ success: true, message: "The product Deleted!!" });
});

const updateProduct = asyncWrapper(async (req, res, nxt) => {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).send('Invalid Product Id');
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("Not Valide")
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(500).send("The Product Can't be created");
    res.json(product);
});

const getProduct = asyncWrapper(async (req, res) => {
    // const product = await Product.find().select("name image -_id");
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) return res.status(404).json({ success: false, message: "Not Found Product" });
    res.json(product);
});

const countProducts = asyncWrapper(async (req, res, nxt) => {
    const countProducts = await Product.countDocuments()
    if (!countProducts) return res.status(400).json({ success: false, message: "Not Found Products" });
    res.send({ success: true, count: countProducts });
});

const getFeaturedProduct = asyncWrapper(async (req, res) => {
    let count = req.query.count ? req.query.count : 0;
    const featuredproduct = await Product.find({ isFeatured: true }).limit(count);
    if (!featuredproduct) return res.status(404).json({ success: false, message: "Not Found Featured Product" });
    res.send(featuredproduct);
});

const galleryImages = asyncWrapper(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).send('Invalid Product Id');
    const files = req.files;
    if (!files) return res.status(400).send("No Image in request");
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    files.map((file) => {
        imagesPaths.push(`${basePath}${file.filename}`);
    });
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            images: imagesPaths
        },
        { new: true}
    );
    if(!product) return res.status(500).send('the gallery cannot be updated!');
    res.send(product);
});

module.exports = {
    getAllProducts,
    createProduct,
    deleteProduct,
    updateProduct,
    getProduct,
    idParam,
    countProducts,
    getFeaturedProduct,
    galleryImages
}