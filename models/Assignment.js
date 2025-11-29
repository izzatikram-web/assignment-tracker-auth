// models/Assignment.js
// This file defines the data structure for assignments in MongoDB.

const mongoose = require('mongoose');

// Schema: what fields an assignment has
const assignmentSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    weightage: {
      type: Number,
      default: 0,
    },

    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed'],
      default: 'Not Started',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
  },
  {
    timestamps: true, // automatically store createdAt and updatedAt
  }
);

// Export model so we can use it in routes
module.exports = mongoose.model('Assignment', assignmentSchema);
