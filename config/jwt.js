const { expressjwt: jwt } = require("express-jwt");

function authJwt() {
    const secret = process.env.JWT_SEC;
    const api = process.env.API;
    return jwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
            // { url: /\/api\/v1\/orders(.*)/, methods: ['GET', 'OPTIONS'] },
            `${api}/users/login`,
            `${api}/users/register`,
        ]
    });
}

const isRevoked = (req, token) => {
    if (token.payload.isAdmin) {
        // Admins have full access to all resources
        return false;
    } else if (!token.payload.isAdmin) {
        // Regular users can access POST And DELETE requests for Orders and all endpoint it works for her unless
        if (req.method === "POST" || req.method === "DELETE" || req.method === "GET" && ['/api/v1/orders'].some(path => req.originalUrl.startsWith(path))) {
            return false;
        }
    }
    // All other requests are unauthorized
    console.trace("Unauthorized")
    return true;
}



module.exports = authJwt;