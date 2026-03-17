import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Invalid token");
        }
        const decodedObj = await jwt.verify(token, "secretkey");
        const user = await User.findById(decodedObj._id);
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(401).send("ERROR : " + err.message);
    }
}