// routes/quizRoutes.js
const express = require('express');
const Quiz = require('../models/Quiz');
const Subject = require('../models/Subject');
const router = express.Router();
const User = require('../models/User');


// 3. Create a new quiz
router.post('/create', async (req, res) => {
    const { subjectId, title, questions } = req.body;
  
    // Validate required fields
    if (!subjectId || !title || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Subject, title, and at least one question are required' });
    }
  
    try {
      // Check if the subject exists
      const subject = await Subject.findById(subjectId);
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
  
      // Create a new quiz
      const newQuiz = new Quiz({
        subject: subjectId,
        title,
        questions,
      });
  
      await newQuiz.save();
      res.status(201).json(newQuiz);
    } catch (error) {
      res.status(500).json({ message: 'Error creating quiz', error });
    }
  });

// Endpoint to get quizzes by subject
router.get('/getBySubject/:subjectId', async (req, res) => {
  console.log(req);
  const subjectId = req.params.subjectId; // Correctly access the path parameter

  try {
      const quizzes = await Quiz.find({ subject: subjectId }).populate('subject', 'name');
      res.json(quizzes);
  } catch (error) {
      console.error('Error fetching quizzes:', error);
      res.status(500).send('Server error');
  }
});

  
  // 2. Get a specific quiz by ID
router.get('/:quizId', async (req, res) => {
    try {
      const quiz = await Quiz.findById(req.params.quizId).populate('subject', 'name');
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching quiz', error });
    }
  });

// 4. Update an existing quiz
router.put('/:quizId', async (req, res) => {
    const { subjectId, title, questions } = req.body;
  
    try {
      // Check if the subject exists
      const subject = subjectId ? await Subject.findById(subjectId) : null;
      if (subjectId && !subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
  
      const updatedQuiz = await Quiz.findByIdAndUpdate(
        req.params.quizId,
        { subject: subjectId || undefined, title, questions },
        { new: true }
      );
  
      if (!updatedQuiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
  
      res.json(updatedQuiz);
    } catch (error) {
      res.status(500).json({ message: 'Error updating quiz', error });
    }
  });

  // 5. Delete a quiz
router.delete('/:quizId', async (req, res) => {
    try {
      const deletedQuiz = await Quiz.findByIdAndDelete(req.params.quizId);
      if (!deletedQuiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting quiz', error });
    }
  });

  // Save quiz score to the user's document
  router.post('/save-quiz-score', async (req, res) => {
    const { userId, quizId, subjectId, score, totalQuestions } = req.body;
    console.log(req.body);

    try {
        // Find the user by ID
        const user = await User.findById(userId);

        // Check if the user already has a record for this quiz
        const existingScore = user.quizScores.find(scoreRecord => scoreRecord.quiz.toString() === quizId.toString());

        if (existingScore) {
            // Update the score if the quiz was already taken
            existingScore.score = score;
            existingScore.totalQuestions = totalQuestions;
            existingScore.attemptedAt = Date.now();
        } else {
            // Add new quiz score entry
            user.quizScores.push({
                quiz: quizId,
                subject: subjectId,
                score: score,
                totalQuestions: totalQuestions,
                attemptedAt: Date.now(),
            });
        }
        console.log(user);
        // Save the updated user document
        await user.save();
        
        // Save the updated user document

        res.status(200).json({ message: 'Quiz score saved successfully' });
    } catch (error) {
        console.error('Error saving quiz score:', error);
        res.status(500).json({ message: 'Error saving quiz score' });
    }
});

// Example route to get the user's quiz score for a quiz
router.get('/quiz-scores/:quizId', async (req, res) => {
  const userId = req.user._id; // Assuming you have user authentication
  const quizId = req.params.quizId;

  try {
    const user = await User.findById(userId);
    const quizScore = user.quizScores.find(score => score.quiz.toString() === quizId);
    
    if (quizScore) {
      res.json({ score: quizScore.score });
    } else {
      res.status(404).json({ message: 'Score not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching score' });
  }
});


module.exports = router;
