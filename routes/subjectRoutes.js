// routes/subjectRoutes.js
const express = require('express');
const Subject = require('../models/Subject');
const router = express.Router();

// Create Subject
router.post('/create', async (req, res) => {
  const { name, courseCode } = req.body;

  try {
    const subject = new Subject({ name, courseCode });
    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all subjects
router.get('/', async (req, res) => {
    try {
      const subjects = await Subject.find(); // Retrieve all subjects from the database
      res.status(200).json(subjects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
// Get a single subject by ID
router.get('/:subjectId', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a subject by ID
router.delete('/:subjectId', async (req, res) => {
  try {
    const isDeleted = await Subject.deleteOne({ _id: req.params.subjectId });
    
    if (isDeleted.deletedCount === 0) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json({ message: 'Subject Deleted' });
  } catch (error) {
    console.error('Error deleting subject:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update a subject by ID
router.put('/:subjectId', async (req, res) => {
  try {
    const { name, courseCode } = req.body;

    // Validate input
    if (!name || !courseCode) {
      return res.status(400).json({ message: 'Name and Course Code are required' });
    }

    // Find and update the subject
    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.subjectId,
      { name, courseCode },
      { new: true, runValidators: true } // Return updated document and validate inputs
    );

    if (!updatedSubject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json({ message: 'Subject updated successfully', updatedSubject });
  } catch (error) {
    console.error('Error updating subject:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

  
module.exports = router;
