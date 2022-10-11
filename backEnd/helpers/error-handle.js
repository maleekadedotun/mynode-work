function errorHandler(err, req, res, next) {
    if(err.name === "UnauthorizedError") {
        return res.status(402).json({msg: "The user is not authorized"});
    }
    if(err.name == "validationError"){
        return res.status(401).json({msg: err});
    }
    return res.status(500).json(err)
}

module.exports = errorHandler;