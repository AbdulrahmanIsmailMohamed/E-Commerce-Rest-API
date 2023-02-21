const Category = require("../modules/category");
const asyncWrapper = require("../middleware/async");

const getAllCategory = asyncWrapper(async (req, res) => {
    const category = await Category.find();
    if (!category) return res.status(404).json({ success: false, message: "Not Found Category" });
    res.json(category);
});

const createCategory = asyncWrapper(async (req, res) => {
    const category = new Category(req.body);
    await category.save();
    if (!category) return res.status(400).send("the Category can't be created");
    res.status(201).send(category);
});

const deleteCategory = asyncWrapper(async (req, res) => {
    const category = await Category.findByIdAndRemove(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "the Category Not Found" })
    res.send("The Category Deleted!!");
})

const updateCategory = asyncWrapper(async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(400).send("the Category can't be created");
    res.json({ category })
})

module.exports = {
    getAllCategory,
    createCategory,
    deleteCategory,
    updateCategory
}