const router = require("express").Router();

router.get("/", (req, res) => {
    res.send("hi")
})

module.exports = router;