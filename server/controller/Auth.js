const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Class = require('../models/Class')
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

// Generate a salt
const generateSalt = () => crypto.randomBytes(16).toString('hex');

// Function to create a new user
// Function to create a new user
exports.createUser = async (req, res) => {
    try {
        const { name, email, role, password } = req.body;

        // Validate the request
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields (name, email, password) are required' });
        }

        // Generate a new salt
        const salt = generateSalt();

        // Hash the password with the salt
        crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ message: 'Server error', error: err.message });
            }

            // Create a new user
            const newUser = new User({
                name,
                email,
                role,
                password: hashedPassword.toString('hex'), // Ensure password is in hex format
                salt // Store the salt
            });

            // Save the user to the database
            const savedUser = await newUser.save();

            // Respond with the saved user
            res.status(201).json(savedUser);
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Function to handle user login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate the request
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ message: 'Server error', error: err.message });
            }

            if (hashedPassword.toString('hex') !== user.password) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Create a JWT token
            const token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.name, date: user.createdAt }, SECRET_KEY, { expiresIn: '1h' });

            // Respond with the token
            res.json({ token });
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


exports.enrollUser = async (req, res) => {
    const { classId } = req.params;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;

        // Find the user
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Find the class (optional, but good practice to ensure class exists)
        const cls = await Class.findById(classId);
        if (!cls) return res.status(404).json({ error: 'Class not found' });

        // Check if user is already enrolled
        if (user.enrolledClasses.includes(classId)) {
            return res.status(400).json({ error: 'Already enrolled in this class' });
        }

        // Enroll the user
        user.enrolledClasses.push(classId);
        await user.save();
        res.status(200).json({ message: 'Successfully enrolled in class', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};


exports.getUserById = async (req, res) => {
    const userId = req.params.id; // Get the user ID from the request parameters

    try {
        // Find the user by their ID and populate the enrolled classes
        const user = await User.findById(userId).populate({
            path: 'enrolledClasses',
            populate: {
                path: 'units.sessions.lectures', // Adjust according to your schema
                select: 'title' // Adjust to return only necessary fields
            }
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(user); // Return the user details along with their enrolled classes
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// exports.updateUserProfile = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { name, email } = req.body;
//         const token = req.headers.authorization?.split(' ')[1];

//         if (!token) {
//             return res.status(401).json({ message: "No token provided" });
//         }

//         let userId;
//         try {
//             const decoded = jwt.verify(token, process.env.SECRET_KEY);
//             userId = decoded.id;
//         } catch (err) {
//             return res.status(401).json({ message: "Invalid token" });
//         }

//         // Optional: Check if the token's userId matches the id parameter (if users can only update their own profile)
//         if (userId !== id) {
//             return res.status(403).json({ message: "Not authorized to update this profile" });
//         }

//         const updateProfile = await User.findByIdAndUpdate(id, { $set: { name, email } }, { new: true });
//         if (!updateProfile) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         res.status(200).json(updateProfile);
//     } catch (err) {
//         console.error(err); // Log the error for debugging purposes
//         res.status(500).json({ message: 'Server error', error: err.message });
//     }
// };