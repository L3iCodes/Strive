import jwt from 'jsonwebtoken';

export const generateToken = async (userId, res) => {
    const SECRET_KEY = process.env.SECRET_KEY;
    const token = jwt.sign({userId}, SECRET_KEY, {expiresIn:'7d'})

    res.cookie('jwt', token, {
        maxAge: 7 *24 * 60 * 60 * 1000, //Milisecond
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "development" ? "strict" : "none",
        secure: process.env.NODE_ENV !== 'development' //false when in development
    });
};