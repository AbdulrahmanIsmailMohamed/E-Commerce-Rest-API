module.exports = (err, req, res, nxt) => {
    if (err.name === "UnauthorizedError") {
        console.trace("Unauthorized");
        return res.status(401).send("invalid token...");
    }
    for (let e in err.errors) {
        console.log(e.message);
        res.status(500).send("Internal Servar Error!!")
    }
}