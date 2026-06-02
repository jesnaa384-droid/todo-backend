const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Task = require("../models/Task");

// GET tasks
router.get("/", async (req, res) => {
  try {

    const page = Number(req.query.page) || 1;

    const limit = 5;

    const tasks = await Task.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: tasks,
    });

  } catch (error) {

    res.status(500).json({
      message: "Error fetching tasks",
    });

  }
});

// POST task
router.post("/", async (req, res) => {
  try {

    const newTask = new Task({
      text: req.body.text,
      completed: false,
    });

    await newTask.save();

    res.status(201).json({
      success: true,
      data: newTask,
    });

  } catch (error) {

    res.status(500).json({
      message: "Error creating task",
    });

  }
});

// UPDATE task
router.put("/:id", async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedTask,
    });

  } catch (error) {

    res.status(500).json({
      message: "Error updating task",
    });

  }
});

// DELETE task
router.delete("/:id", async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: "Error deleting task",
    });

  }
});

module.exports = router;