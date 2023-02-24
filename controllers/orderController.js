const asyncWrapper = require("../middleware/async");
const Order = require("../models/order");
const OrderItem = require("../models/orderItems");

const createOrder = asyncWrapper(async (req, res) => {
    console.log(req.body.orderItems);
    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) => {
        const newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        });
        await newOrderItem.save();
        if (!newOrderItem) return res.status(400).send("the Order Items can't be created");
        return newOrderItem._id;
    }));
    let orderItemsIdsSolve = await orderItemsIds;

    // calculate Total Price
    const totalPrices = await Promise.all(orderItemsIdsSolve.map(async (orderItem) => {
        let totalPrice = await OrderItem.findById(orderItem).populate("product", "price");
        const total = totalPrice.product.price * totalPrice.quantity;
        return total
    }));
    const totalPrice = totalPrices.reduce((a, b) => a + b);
    console.log(totalPrice);

    delete req.body.orderItems;
    if (req.body.total) delete req.body.total
    const order = await Order.create({ ...req.body, orderItems: orderItemsIdsSolve, totalPrice: totalPrice })
    if (!order) return res.status(400).send("the Order can't be created");
    res.status(201).json({ success: true, order });
});

const orders = asyncWrapper(async (req, res) => {
    const orders = await Order.find()
        .populate("user", "name")
        .sort({ "dataCreated": -1 });
    if (!orders) return res.status(404).send("the Orders Not Found");
    res.send(orders);
});

const order = asyncWrapper(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate("user", "name")
        .populate({
            path: "orderItems",
            populate: {
                path: "product",
                populate: "category"
            }
        });
    if (!order) return res.status(404).send("the Order Not Found");
    res.send(order);

});

const updateOrder = asyncWrapper(async (req, res) => {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!order) return res.status(400).send("the Order can't be Updated");
    res.status(200).json({ success: true, order });
});

const deleteOrder = asyncWrapper(async (req, res) => {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).send("the Order Not Found");

    // Delete the OrderItems associated with the Order
    order.orderItems.map(async (orderItems) => {
        await OrderItem.findByIdAndDelete(orderItems);
    });

    res.status(200).json({ success: true });
});

const totalSales = asyncWrapper(async (req, res) => {
    const totalSales = await Order.aggregate([
        { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } }
    ]);
    console.log(totalSales);
    if (!totalSales) return res.status(400).send('The order sales cannt be generated');
    res.send({ totalsales: totalSales.pop().totalSales });
});

const countOrders = asyncWrapper(async (req, res) => {
    const countOrders = await Order.countDocuments();
    if (!countOrders) return res.status(400).json({ success: false, message: "Not Found Orders" });
    res.send({ success: true, count: countOrders });
});

const userOrderList = asyncWrapper(async (req, res) => {
    const userOrderList = await Order.find({ user: req.params.userId })
        .populate({
            path: "orderItems",
            populate: {
                path: "product",
                populate: "category"
            }
        });
    if (!userOrderList) return res.status(404).json({ success: false });
    res.send(userOrderList);
});

module.exports = {
    createOrder,
    orders,
    order,
    updateOrder,
    deleteOrder,
    totalSales,
    countOrders,
    userOrderList
}