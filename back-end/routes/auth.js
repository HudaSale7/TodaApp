const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body } = require('express-validator');

const prisma = new PrismaClient();
const router = express.Router();

const authController = require('../controllers/auth');

router.post('/signup', [
    body('userName').trim().toLowerCase()
        .custom((value, { req }) => {
        return prisma.user.findUnique({
            where: {
                userName: value
            }
        }).then(userDoc => {
            if (userDoc) {
                return Promise.reject('user name already exists!');
            }
        });
    }).isLength({ min: 3 }).withMessage('user name must be at least 3 characters long!'),
    body('password').trim().isLength({ min: 5 }).withMessage('password must be at least 5 characters long!')
], authController.signup);

router.post('/login', [
    body('userName').trim().toLowerCase()
],authController.login);

module.exports = router;

