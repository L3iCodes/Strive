import bcrypt from 'bcrypt';
import User from "../models/user.model.js";
import { generateToken } from '../lib/token.js';

export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try{
        // Check if email is already used
        const exists = await User.findOne({email});
        if(exists) return res.status(409).json({message: "Email already exists"});
        if(password.length < 6 ) return res.status(409).json({message: "Password must be at least 7 characters."});

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        const user = new User({
            username,
            email,
            avatar: 'https://avatar.iran.liara.run/public',
            password: hashedPassword,
        });
        await user.save();

        if(user){
            generateToken(user._id, res);
            res.status(202).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
            });
        };
    }catch(error){
        console.log('Error in signup controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    };
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    
    try{
        const user = await User.findOne({email});
        if(!user) return res.status(409).json({message: "User does not exists"});
        if(!await bcrypt.compare(password, user.password)) return res.status(409).json({message: "Incorrect email or password"});

        generateToken(user._id, res);
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
        });
    }catch(error){
        console.log('Error in login controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};

export const logout = async (req, res) => {
    try{
        res.cookie("jwt", "", {maxAge: 0});
        return res.status(200).json({ message: "Logout Succesfully"});
    }catch(error){
        console.log('Error in logout controller', error);
        return res.status(500).json({ message: "Internal Server Error"});
    };
}

export const checkAuth = (req, res) => {
    try{
        res.status(200).json(req.user);
    }catch(error){
        console.log('Error in CheckAuth Controller', error.message);
        return res.status(500).json({ message: "Internal Server Error"});
    };
};