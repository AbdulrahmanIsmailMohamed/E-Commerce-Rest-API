const express = require("express");
require("dotenv").config();
require("./db/connect")

const app = express();

// morgan
const morgan = require("morgan");
app.use(morgan("tiny")); // HTTP request logger middleware for node.js

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// routes
const userRoute = require("./routes/users");
const categoryRoute = require("./routes/categories");
const orderRoute = require("./routes/orders");
const productRoute = require("./routes/products");

const api = process.env.API
app.use(`${api}/user`, userRoute);
app.use(`${api}/category`, categoryRoute);
app.use(`${api}/order`, orderRoute);
app.use(`${api}/product`, productRoute);


// listening server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server Listening On PORT ${port}`);
})