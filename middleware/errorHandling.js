module.exports = (err, req, res, nxt) => {
    if (err.name === "UnauthorizedError") {
        return res.status(401).send("invalid token...");
    }
    for (const e in err.errors) {
        console.log(e.message);
        res.status(500).send("Internal Servar Error!!")
    }
}