const router = require("express").Router();
const {
    users,
    register,
    user,
    login
} = require("../controllers/userController");


router.get("/", users);

router.post("/register", register);

router.post("/login", login);

router.get("/:id",user);

module.exports = router;