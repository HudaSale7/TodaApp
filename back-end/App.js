const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());

//routes
const authRouter = require('./routes/auth');
const taskRouter = require('./routes/task');

//middleware
app.use('/auth', authRouter);
app.use('/task', taskRouter);

//error handling
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message , status: status});
});


app.listen(3000);