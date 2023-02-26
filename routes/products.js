const router = require("express").Router();
const uploadOptions = require("../middleware/multer");

const {
    getAllProducts,
    createProduct,
    deleteProduct,
    updateProduct,
    getProduct,
    idParam,
    countProducts,
    getFeaturedProduct,
    galleryImages
} = require("../controllers/productController");

router.param("id", idParam) // check about id

router.route("/").get(getAllProducts).post(uploadOptions.single("image"), createProduct);

router.get("/get/count", countProducts);

router.get("/get/featured", getFeaturedProduct);

router.get("/getProduct/:id", getProduct);

router.route("/:id").delete(deleteProduct).put(updateProduct);

router.put("/gallery-images/:id", uploadOptions.array("images", 10), galleryImages);

module.exports = router;