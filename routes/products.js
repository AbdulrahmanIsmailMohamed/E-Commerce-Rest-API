const router = require("express").Router();

const {
    getAllProducts,
    createProduct,
    deleteProduct,
    updateProduct,
    getProduct,
    idParam,
    countProducts,
    getFeaturedProduct
} = require("../controllers/productController");

router.param("id", idParam) // check about id

router.route("/").get(getAllProducts).post(createProduct);

router.get("/get/count", countProducts);

router.get("/get/featured", getFeaturedProduct);

router.get("/getProduct/:id", getProduct);

router.route("/:id").delete(deleteProduct).put(updateProduct)

module.exports = router;