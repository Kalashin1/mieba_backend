/* eslint-disable prettier/prettier */
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_AUTH_SECRETE, JWT_PAYLOAD, JWT_AUTH_EXPIRY_DATE } from 'src/interface/types';

const saltRounds = 12;

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
}

export const verifyPassword = async (userEntered: string, userPassword: string) => {
  return await bcrypt.compare(userEntered, userPassword);
}

export const generateJWT = async (payload: Partial<JWT_PAYLOAD>) => {
  return jwt.sign(payload, JWT_AUTH_SECRETE, { expiresIn: JWT_AUTH_EXPIRY_DATE })
}

export const verifyJWT = async (token: string) => {
  return await jwt.verify(token, JWT_AUTH_SECRETE);
}

