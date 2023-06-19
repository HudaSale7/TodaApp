const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

exports.signup = async (req, res, next) => {
    try {
        //check if validation failed and throw error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('validation failed!');
            error.statusCode = 422;
            error.message = errors.array()[0].msg;
            throw error;
        }
        const userName = req.body.userName;
        const password = req.body.password;

        //hashing password and saving user to database
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: {
                userName: userName,
                password: hashedPassword
            }
        });
        if (!user) {
            const error = new Error('server error!');
            error.statusCode = 500;
            throw error;
        }
        //create token and send response
        const token = createToken(user);
        res.status(200).json({ token: token, userName: userName, id: user.id});
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.login = async (req, res, next) => {
    const userName = req.body.userName;
    const password = req.body.password;
    try {
        //check if validation failed and throw error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('validation failed!');
            error.statusCode = 422;
            error.message = errors.array()[0].msg;
            throw error;
        }

        //check if user exists and password is correct otherwise throw error
        const user = await prisma.user.findUnique({
            where: {
                userName: userName
            }
        });
        if (!user) {
            const error = new Error('user not found!');
            error.statusCode = 401;
            throw error;
        }
        
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error('wrong password!');
            error.statusCode = 401;
            throw error;
        }
        const token = createToken(user);
        res.status(200).json({ token: token});
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

//create token function to be used in signup and login
createToken = (user) => {
    return jwt.sign(
    {
        userName: user.userName,
        userId: user.id.toString(),
    },
    "secretkey",
    );
};