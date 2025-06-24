import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export function generateTokens(user) {
  const accessToken = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, { expiresIn: '45m' });
  const refreshToken = jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
}

export function verifyToken(token) {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}
