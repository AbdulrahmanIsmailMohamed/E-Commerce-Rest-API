const User = require("../models/user");
const asyncWrapper = require("../middleware/async");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
require("dotenv").config()

const users = asyncWrapper(async (req, res) => {
    const users = await User.find().select("-password");
    if (!users) return res.status(500).json({ success: false, message: "Not Found Users" });
    res.send(users);
});

const register = asyncWrapper(async (req, res) => {
    const password = bcrypt.hashSync(req.body.password, 10); // hash password
    delete req.body.password;
    const user = await User.create({ ...req.body, password });
    if (!user) return res.status(400).send("the User can't be created");
    res.status(201).json({ success: true, user });
});

const user = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "Not Found User" });
    res.json(user);
});

const login = asyncWrapper(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ success: false, message: "The email is not registered, please register!!" });
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
        const secret = process.env.JWT_SEC
        const token = jwt.sign(
            {
                id: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            { expiresIn: "1d" }
        );
        res.json({ success: true, token: token });
    }
    res.status(400).send('password is wrong!');

});

const updateUser = asyncWrapper(async (req, res) => {
    const userExist = await User.findById(req.params.id);
    if (!userExist) return res.status(404).send("The User Not Found");
    let newPassword;
    if (req.body.password) newPassword = bcrypt.hashSync(req.body.password, 10);
    else newPassword = userExist.password;
    delete req.body.password;
    const user = await User.findByIdAndUpdate(
        req.params.id,
        { ...req.body, password: newPassword },
        { new: true }
    );
    if (!user) return res.status(400).json({ success: false, message: "The User Can't be Updated" });
    res.send(user)
});

const deleteUser = asyncWrapper(async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(400).json({ success: false, message: "The User can't Be Deleted" });
    res.json({ success: true })
})


module.exports = {
    users,
    register,
    user,
    login,
    updateUser,
    deleteUser
}