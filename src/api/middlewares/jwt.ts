import { type Request, type Response, type NextFunction } from 'express';import { type JWTPayload, SignJWT, jwtVerify, type JWTVerifyResult } from 'jose';
import dotenv from 'dotenv';
import { ErrorType } from '../../errors/types';
import { UserService } from '../../domains/users/services';
import { firestoreDB } from '../../gateways/firestore/db';
import { UsersRepository } from '../../domains/users/repository';
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

export class JWT {
  private secretKey: string | undefined;
  constructor(private userService: UserService) {
    this.secretKey = process.env.JWT_SECRET_KEY;
    if (this.secretKey === undefined) {
      console.log('JWT_SECRET_KEY is not defined');
      throw { status: 500, message: 'Internal server error' };
    }
  }
  encodeJWT = async (payload: { uid: string }): Promise<string> => {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (secretKey === undefined) {
      console.log('JWT_SECRET_KEY is not defined');
      throw { status: 500, message: 'Internal server error' };
    }
    const secretKeyUint8Array = new TextEncoder().encode(secretKey);
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secretKeyUint8Array);
  };

  decodeJWT = async (token: string): Promise<JWTVerifyResult<Payload>> => {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (secretKey === undefined) {
      console.log('JWT_SECRET_KEY is not defined');
      throw { status: 500, message: 'Internal server error' };
    }
    const secretKeyUint8Array = new TextEncoder().encode(secretKey);
    const verified = await jwtVerify<Payload>(token, secretKeyUint8Array, {
      algorithms: ['HS256'],
    });
    if (verified === undefined) {
      console.log('verified is not defined');
      throw { status: 500, message: 'Internal server error' };
    }
    if (verified.payload.uid === undefined) {
      console.log('uid is not defined');
      throw { status: 500, message: 'Internal server error' };
    }
    return verified;
  };

  public middleware = (req: Request, res: Response, next: NextFunction): any => {
    const authorization = req.headers.authorization;
    if (authorization === undefined) {
      return res.status(401).send('Unauthorized');
    }
    const token = authorization.split(' ')[1];
    if (token === undefined) {
      return res.status(401).send('Unauthorized');
    }
    this.userService
      .jwtExists(token)
      .then((exists) => {
        if (!exists) {
          return res.status(401).send('Unauthorized');
        }
        this.decodeJWT(token)
          .then((payload) => {
            req.payload = payload.payload;
            next();
          })
          .catch((error: ErrorType) => {
            return res.status(403).send('Forbidden');
          });
      })
      .catch((error: ErrorType) => {
        return res.status(403).json({ message: 'Forbidden', status: 403 });
      });
  };
}

export const jwt = () => {
  const db = firestoreDB();
  const usersRepository = new UsersRepository(db, 'users');
  const userService = new UserService(usersRepository);
  const jwt = new JWT(userService);
  return jwt;
};
