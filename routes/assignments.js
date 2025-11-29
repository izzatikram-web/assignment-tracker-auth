// routes/assignments.js
const express = require("express");
const router = express.Router();
const Assignment = require("../models/Assignment");

// Simple middleware to protect routes
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  // Not logged in → redirect to home (or a login page if you prefer)
  return res.redirect("/login");
}

// GET /assignments - list all assignments (PROTECTED: login required)
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ dueDate: 1 });
    res.render("assignments/list", { title: "Dashboard", assignments });
  } catch (err) {
    console.error("Error fetching assignments:", err);
    res.send("Error fetching assignments");
  }
});


// GET /assignments/add - show form to add new assignment (PROTECTED)
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("assignments/add", { title: "Add Task" });
});

// POST /assignments/add - create a new assignment (PROTECTED)
router.post("/add", ensureAuthenticated, async (req, res) => {
  try {
    const assignment = new Assignment({
      courseName: req.body.courseName,
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      status: req.body.status,
      priority: req.body.priority,
      weightage: req.body.weightage ? Number(req.body.weightage) : 0,
    });

    await assignment.save();
    res.redirect("/assignments");
  } catch (err) {
    console.error("Error creating assignment:", err);
    res.send("Error creating assignment");
  }
});

// GET /assignments/edit/:id - show edit form (PROTECTED)
router.get("/edit/:id", ensureAuthenticated, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.send("Assignment not found");
    }

    res.render("assignments/edit", {
      title: "Edit Task",
      assignment,
    });
  } catch (err) {
    console.error("Error loading assignment:", err);
    res.send("Error loading assignment");
  }
});

// POST /assignments/edit/:id - update assignment (PROTECTED)
router.post("/edit/:id", ensureAuthenticated, async (req, res) => {
  try {
    console.log("EDIT BODY:", req.body);   // ⭐ add this line

    await Assignment.findByIdAndUpdate(req.params.id, {

      courseName: req.body.courseName,
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      status: req.body.status,
      priority: req.body.priority,
      weightage: req.body.weightage ? Number(req.body.weightage) : 0,
    });

    res.redirect("/assignments");
  } catch (err) {
    console.error("Error updating assignment:", err);
    res.send("Error updating assignment");
  }
});

// GET /assignments/delete/:id - show delete confirmation (PROTECTED)
router.get("/delete/:id", ensureAuthenticated, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.send("Assignment not found");
    }

    res.render("assignments/delete", {
      title: "Delete Task",
      assignment,
    });
  } catch (err) {
    console.error("Error loading delete page:", err);
    res.send("Error loading delete page");
  }
});

// POST /assignments/delete/:id - actually delete (PROTECTED)
router.post("/delete/:id", ensureAuthenticated, async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.redirect("/assignments");
  } catch (err) {
    console.error("Error deleting assignment:", err);
    res.send("Error deleting assignment");
  }
});

module.exports = router;
