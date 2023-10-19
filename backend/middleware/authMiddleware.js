import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async(req, res, next) => {
    let token;

    // token = req.cookies.jwt;

    // if (token) {
    //     try {
    //         const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //         req.user = await User.findById(decoded.userId).select('-password');
            
    //         next();
    //     } catch (error) {
    //         res.status(401);
    //         throw new Error('Not authorized, invalid token');
    //     }
    // } else {
    //     res.status(405);
    //     throw new Error('Not authorized, no token');
    // }
    const authHeader = req.headers['authorization'];

    if (authHeader && authHeader.startsWith('Bearer')) {
        // Extract the token from the Authorization header
        token = authHeader.split(' ')[1];

        // console.log('Received a token:', token);

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log('Decoded token:', decoded);
            // console.log(decoded.userId);
            req.user = await User.findById(decoded.userId).select('-password');

            // console.log(req.user);
            
            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, invalid token');
        }
    } else {
        res.status(405);
        throw new Error('Not authorized, no token');
    }
});

export { protect };