const jwt = require('jsonwebtoken');

isAuth = (req, res, next) => {
    //get token from header
    const token = req.headers.token;
    try {
        //check if token is valid otherwise throw error
        if (!token) {
            const error = new Error('not authenticated!');
            error.statusCode = 401;
            throw error;
        }
        const decodedToken = jwt.verify(token, 'secretkey');
    
        if (!decodedToken) {
            const error = new Error('not authenticated!');
            error.statusCode = 401;
            throw error;
        }
        //set userId in request
        req.userId = parseInt(decodedToken.userId);
        //call next middleware
        next();
    }  catch (error) {
        error.statusCode = 500;
        next(error);
    }
}

module.exports = isAuth;