const express = require("express");
require("dotenv").config();
require("./db/connect")
const errorHandling = require("./middleware/errorHandling");
const authJwt = require("./config/jwt")
const cors = require("cors")
const app = express();

app.use(cors());
app.options('*', cors())

// morgan
const morgan = require("morgan");
app.use(morgan("tiny")); // HTTP request logger middleware for node.js

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(errorHandling);
app.use(authJwt());


// routes
const userRoute = require("./routes/users");
const categoryRoute = require("./routes/categories");
const orderRoute = require("./routes/orders");
const productRoute = require("./routes/products");

const api = process.env.API
app.use(`${api}/users`, userRoute);
app.use(`${api}/categorys`, categoryRoute);
// app.use(`${api}/orders`, orderRoute);
app.use(`${api}/products`, productRoute);



// listening server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server Listening On PORT ${port}`);
})