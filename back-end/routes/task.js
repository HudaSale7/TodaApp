const express = require("express");
const { body } = require("express-validator");

const router = express.Router();
const taskController = require("../controllers/task");
const isAuth = require("../middleware/isAuth");

router.post("/add", isAuth, taskController.addTask);
router.get("/all", isAuth, taskController.getTasks);
router.delete("/delete/:id", isAuth, taskController.deleteTask);
router.put("/complete/:id", isAuth, taskController.completeTask);

module.exports = router;
