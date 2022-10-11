// JWT FOR SECURITY

const { expressjwt : expressjwt} = require("express-jwt");

function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL
    return expressjwt({ secret, algorithms: ["HS256"], isRevoked: isRevoked}).unless({
        path: [
            // { url: `${api}/products`, method: ["GET", OPTIONS] },
            { url: /\/api\/v1\/products(.*)/, method: ["GET", "OPTIONS"] },   // To get all product request
            // Icluding parameters
            // { url: ${`api}/categories`, method : ["GET", "OPTIONS"] },
            {url: /\/api\/v1\/categories(.*)/, method: ["GET", "OPTIONS"] },  // TO GET ALL CATEGORIES REQUEST
             // Icluding parameters
             { url: /\/api\/v1\/orders(.*)/, methods: ["GET", "OPTIONS"] },  // TO GET ALL ORDERS REQUEST INCLUDING
             // PARAMETERS
             { url: `${api}/users`, method: ["GET", "OPTIONS"] },
             `${api}/users/login`,
             `${api}/users/register`,
        ]
    })
}


async function isRevoked(req, token){
    // console.log(token.payload.isAdmin);
    if(token.payload.isAdmin === false){
        return true;
    }
    else{
        return false
    }
}

module.exports = authJwt

// function to set role between Admin and Users
// req = token , token = data embeded in the token