const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

// Authentication middleware
exports.authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(decoded.id);
        console.log(token, decoded, user)
        if (!user) {
            throw new Error();
        }

        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        res.status(401).json({ message: 'Please authenticate.' });
    }
};

// Authorization middleware
exports.authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        console.log('User Role:', req.user.role); // Debugging log
        console.log('Required Roles:', roles); // Debugging log

        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied.' });
        }
        next();
    };
};
