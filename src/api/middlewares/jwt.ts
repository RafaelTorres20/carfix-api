import { type Request, type Response, type NextFunction } from 'express';
import { type JWTPayload, SignJWT, jwtVerify, type JWTVerifyResult } from 'jose';
import dotenv from 'dotenv';
dotenv.config();
declare global {
  namespace Express {
    export interface Request {
      payload: Payload;
    }
  }
}

export interface Payload extends JWTPayload {
  uid: string;
}

export const jwtMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authorization = req.headers.authorization;
  if (authorization === undefined) {
    res.status(401).send('Unauthorized');
    return;
  }
  const token = authorization.split(' ')[1];
  if (token === undefined) {
    res.status(401).send('Unauthorized');
    return;
  }
  try {
    decodeJWT(token)
      .then((payload) => {
        req.payload = payload.payload;
        next();
      })
      .catch((error) => {
        res.status(403).send('Forbidden');
      });
  } catch (error) {
    res.status(403).send('Forbidden');
  }
};

export const encodeJWT = async (payload: { uid: string }): Promise<string> => {
  const secretKey = process.env.JWT_SECRET_KEY;
  if (secretKey === undefined) {
    throw { status: 500, message: 'Internal server error' };
  }
  const secretKeyUint8Array = new TextEncoder().encode(secretKey);
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secretKeyUint8Array);
};

export const decodeJWT = async (token: string): Promise<JWTVerifyResult<Payload>> => {
  const secretKey = process.env.JWT_SECRET_KEY;
  if (secretKey === undefined) {
    throw { status: 500, message: 'Internal server error' };
  }
  const secretKeyUint8Array = new TextEncoder().encode(secretKey);
  const verified = await jwtVerify<Payload>(token, secretKeyUint8Array, {
    algorithms: ['HS256'],
  });
  if (verified === undefined) {
    throw new Error('Payload is missing in JWT');
  }
  if (verified.payload.uid === undefined) {
    throw new Error('UID is missing in JWT payload');
  }
  return verified;
};

// TODO: add blacklist and refresh token
