import jwt from 'jsonwebtoken';

// Your secret key (can be anything for testing)
// Secret key (can use string)
const JWT_SECRET: jwt.Secret = 'supersecretkey';

interface TokenPayload {
  id: number;
  email?: string;
}

// Payload
const payload: TokenPayload = { id: 123, email: 'test@example.com' };

// Options
const options: jwt.SignOptions = { expiresIn: '7d' };

// Generate token
const token = jwt.sign(payload, JWT_SECRET, options);

console.log('JWT:', token);
