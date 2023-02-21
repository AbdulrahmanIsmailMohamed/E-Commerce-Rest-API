const router = require("express").Router();

const {
    getAllCategory,
    createCategory,
    deleteCategory,
    updateCategory
} = require("../controllers/categoryController");

router.route("/").get(getAllCategory).post(createCategory);
router.route("/:id").delete(deleteCategory).put(updateCategory);

module.exports = router;