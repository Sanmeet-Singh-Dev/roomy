import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    // console.log('Generating token for user:', userId);
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
    console.log('Generated token:', token);

    return token;
}

export default generateToken;