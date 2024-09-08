const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        const userId = req.body.userId || req.query.userId;
        if (userId && tokenStorage[userId]) {
            req.headers['authorization'] = `Bearer ${tokenStorage[userId]}`;
        }
    }

    const extractedToken = req.headers['authorization']?.split(' ')[1];
    if (!extractedToken) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(extractedToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
};
