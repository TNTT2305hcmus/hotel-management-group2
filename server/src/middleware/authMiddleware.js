import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // Get token from header: "Authorization: Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided!" });
    }

    try {
        const secret = process.env.JWT_SECRET || 'your-secret-key';
        const verified = jwt.verify(token, secret);
        req.user = verified; // Attach user info to request for later use
        next(); // Proceed to the Controller
    } catch (err) {
        return res.status(403).json({ message: "Invalid Token!" });
    }
};