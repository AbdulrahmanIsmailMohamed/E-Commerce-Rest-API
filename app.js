const express = require("express");
require("dotenv").config();
const morgan = require("morgan");

const app = express();

// middleware
app.use(morgan("tiny")) // HTTP request logger middleware for node.js
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/api/v1/products", (req, res) => {
    const products = req.body;
    res.json(products);
})

// listening server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server Listening On PORT ${port}`);
})