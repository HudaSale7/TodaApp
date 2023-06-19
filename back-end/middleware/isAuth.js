const jwt = require('jsonwebtoken');

isAuth = (req, res, next) => {
    const token = req.headers.token;
    try {
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
        req.userId = parseInt(decodedToken.userId);
        next();
    }  catch (error) {
        error.statusCode = 500;
        next(error);
    }
}

module.exports = isAuth;