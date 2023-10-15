import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    console.log('Generating token for user:', userId);
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    return token;
}

export default generateToken;