const { PrismaClient } = require('@prisma/client');
const e = require('express');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

exports.addTask = async (req, res, next) => {
    const content = req.body.content;
    const userId = req.userId;
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            const error = new Error('validation failed!');
            error.statusCode = 422;
            error.message = errors.array()[0].msg;
            throw error;
        }
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            const error = new Error('user not found!');
            error.statusCode = 404;
            throw error;
        }
        const newTask = await prisma.task.create({
            data: {
                content: content,
                userId: userId
            }
        });
        if (!newTask) {
            const error = new Error('server error!');
            error.statusCode = 500;
            throw error;
        }
        res.status(200).json({ taskId: newTask.id});
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getTasks = async (req, res, next) => {
    const userId = req.userId;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            const error = new Error('user not found!');
            error.statusCode = 404;
            throw error;
        }
        const tasks = await prisma.task.findMany({
            where: {
                userId: userId
            }
        });
        if (!tasks) {
            const error = new Error('server error!');
            error.statusCode = 500;
            throw error;
        }
        res.status(200).json({ tasks: tasks });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.deleteTask = async (req, res, next) => {
    const taskId = parseInt(req.params.id);
    const userId = req.userId;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            const error = new Error('user not found!');
            error.statusCode = 404;
            throw error;
        }
        const task = await prisma.task.findUnique({
            where: {
                id: taskId
            }
        });
        if (!task) {
            const error = new Error('task not found!');
            error.statusCode = 404;
            throw error;
        }
        if (userId !== task.userId) {
            const error = new Error('not allowed!');
            error.statusCode = 404;
            throw error;
        }
        const deletedTask = await prisma.task.delete({
            where: {
                id: taskId
            }
        });
        if (!deletedTask) {
            const error = new Error('server error!');
            error.statusCode = 500;
            throw error;
        }
        res.status(200).json({ message: 'task deleted!' });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.completeTask = async (req, res, next) => {
    const taskId = parseInt(req.params.id);
    const userId = req.userId;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            const error = new Error('user not found!');
            error.statusCode = 404;
            throw error;
        }
        const task = await prisma.task.findUnique({
            where: {
                id: taskId
            }
        });
        if (!task) {
            const error = new Error('task not found!');
            error.statusCode = 404;
            throw error;
        }
        if (userId !== task.userId) {
            const error = new Error('not allowed!');
            error.statusCode = 404;
            throw error;
        }
        const completedTask = await prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                completed: (!task.completed)
            }
        });
        
        if (!completedTask) {
            const error = new Error('server error!');
            error.statusCode = 500;
            throw error;
        }
        res.status(200).json({ message: 'task completed!' });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}