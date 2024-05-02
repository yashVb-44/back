const User = require('../models/userModel');
const multer = require('multer')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

const upload = multer({ storage: storage }).array('images', 5)

// Create a new user
exports.createUser = async (req, res) => {
    try {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: 'File upload error' });
            } else if (err) {
                return res.status(500).json({ message: 'Internal server error' });
            }

            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                // Delete the uploaded images if user creation fails
                req.files.forEach(file => {
                    fs.unlinkSync(file.path);
                });
                return res.status(400).json({ message: 'Email already exists' });
            }
            // Handle form-data
            const { username, email, password, hobbies, state, city } = req.body;
            const images = req.files.map(file => file.path);

            const newUser = new User({ username, email, password, hobbies, state, city });
            await newUser.save();
            newUser.images = images;
            return res.status(201).json(newUser);

        });
    } catch (error) {
        req.files.forEach(file => {
            fs.unlinkSync(file.path);
        });
        res.status(400).json({ message: error.message });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a user by ID
exports.updateUserById = async (req, res) => {
    try {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: 'File upload error' });
            } else if (err) {
                return res.status(500).json({ message: 'Internal server error' });
            }

            const { id } = req.params;
            const { username, email, password, hobbies, state, city } = req.body;

            // Find the user by ID
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Update user fields
            user.username = username || user.username;
            user.email = email || user.email;
            user.password = password || user.password;
            user.hobbies = hobbies || user.hobbies;
            user.state = state || user.state;
            user.city = city || user.city;

            // Handle image uploads
            if (req.files && req.files.length > 0) {
                // Delete previous images
                user.images.forEach(image => {
                    fs.unlinkSync(image); // Delete previous images from the server
                });

                // Add new images
                const images = req.files.map(file => file.path);
                user.images = images;
            }

            // Save the updated user
            await user.save();
            res.status(200).json(user);
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a user by ID
exports.deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
