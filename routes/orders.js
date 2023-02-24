const {
    createOrder,
    orders,
    order,
    updateOrder,
    deleteOrder,
    userOrderList,
    countOrders,
    totalSales
} = require("../controllers/orderController");

const router = require("express").Router();

router.route("/").post(createOrder).get(orders);

router.route("/:id").get(order).put(updateOrder).delete(deleteOrder)

router.get("/get/count", countOrders);

router.get("/get/totalsales", totalSales);

router.get("/get/:userId", userOrderList);

module.exports = router;