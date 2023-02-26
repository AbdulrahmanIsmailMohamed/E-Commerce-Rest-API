const router = require("express").Router();
const {
    users,
    register,
    user,
    login,
    updateUser,
    deleteUser
} = require("../controllers/userController");


router.get("/", users);

router.post("/register", register);

router.post("/login", login);

router.route("/:id").get(user).put(updateUser).delete(deleteUser);

module.exports = router;