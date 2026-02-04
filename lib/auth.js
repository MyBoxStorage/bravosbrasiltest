import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getUserByEmail, createUser, getUserById } from './database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export async function authenticateUser(email, password) {
  const user = getUserByEmail(email);
  if (!user) {
    return null;
  }

  const isValid = await comparePassword(password, user.senha_hash);
  if (!isValid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    tentativas_restantes: user.tentativas_restantes || 10
  };
}

export async function registerUser(email, password) {
  const existingUser = getUserByEmail(email);
  if (existingUser) {
    throw new Error('Email já cadastrado');
  }

  const senha_hash = await hashPassword(password);
  const user = createUser({
    email,
    senha_hash,
    tentativas_restantes: 10
  });

  return {
    id: user.id,
    email: user.email,
    tentativas_restantes: user.tentativas_restantes
  };
}

export function getUserIdFromRequest(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  return decoded ? decoded.userId : null;
}
