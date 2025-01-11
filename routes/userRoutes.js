const express = require('express');
const router = express.Router();
const User = require('../models/User');



// GET USER DETAILS
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the user by ID
        const user = await User.findById(id, '-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update User Details
router.put('/:id', async (req, res) => {
    console.log(req.body);
    try {
        const { id } = req.params;
        const { name, email, semester, regNo } = req.body;

        // Validate if user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user details
        user.name = name || user.name;
        user.email = email || user.email;
        user.semester = semester || user.semester;
        user.regNo = regNo || user.regNo;

        await user.save();

        // Exclude password from the response
        const { password: _, ...updatedUser } = user.toObject();
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
