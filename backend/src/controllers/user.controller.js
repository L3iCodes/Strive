import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";
import bcrypt from 'bcrypt';

export const changePassword = async (req, res) => {
    const { _id } = req.user;
    const { oldPassword, newPassword } = req.body;

    try{
        const user = await User.findById( _id );
        if(!user) return res.status(409).json({message: "User does not exists"});
        if(!await bcrypt.compare(oldPassword, user.password)) return res.status(409).json({message: "Old password does not match"});
        if(await bcrypt.compare(newPassword, user.password)) return res.status(409).json({message: "Password is still the same"});

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(
            _id,
            { $set: {password: hashedPassword} },
            { new: true },
        );

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
        });
    }catch(error){
        console.log('Error in changePassword Controller', error.message);
        return res.status(500).json({ message: "Internal Server Error"});
    };
};

export const updateProfile = async (req, res) => {
    const { _id } = req.user;
    const {profilePicture} = req.body;

    try{
        // Upload image in cloudinary
        const uploadResponse = await cloudinary.uploader.upload(
            profilePicture,
            {
                folder: 'Profile-Pictures'
            }
        );
        if(!uploadResponse) return res.status(409).json({message: "Upload failed"});

        const user = await User.findByIdAndUpdate(
            _id,
            { $set: { avatar: uploadResponse.secure_url } },
            { new: true },
        );

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
        });
    }catch(error){
        console.log('Error in updateProfile Controller', error.message);
        return res.status(500).json({ message: "Internal Server Error"});
    };
};