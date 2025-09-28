import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const authenticateToken = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        if(!token) return res.status(401).json({ message: "Unauthorize - No Token Provided"});

        jwt.verify(token, process.env.SECRET_KEY, async (error, decoded) => {
            if(error){
                return res.status(401).json({ message: "Unauthorize - Invalid Token"});
            };

            const user = await User.findById(decoded.userId).select('-password -boards');
            req.user = user;

            next();
        });

    }catch(error){
        console.log('Error in Middleware authenticateToken', error.message)
        return res.status(500).json({ message: "Internal Server Error"});
    };
};