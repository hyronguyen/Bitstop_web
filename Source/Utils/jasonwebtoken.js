import jwt from 'jsonwebtoken';

// Secret key (store this in your .env file for security)
const SECRET_KEY = process.env.JWT_SECRET || 'bitstop';


// Function to generate a token
export const generateToken = (user) => {
  return jwt.sign({  id: user.id  }, SECRET_KEY, {
    expiresIn: '7d',
  });
};


// Function to verify a token
export const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};
