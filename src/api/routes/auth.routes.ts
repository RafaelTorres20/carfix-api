import express from 'express';
import { LoginData, login } from '../../domains/auth/models';
import { to } from '../../utils/to';
import { firestoreDB } from '../../gateways/firestore/db';
import { AuthServices } from '../../domains/auth/services';
import { UserService } from '../../domains/users/services';
import { UsersRepository } from '../../domains/users/repository';
import { ErrorType } from '../../errors/types';
import { JWT } from '../middlewares/jwt';

class AuthRouter {
  public router: express.Router;
  constructor(private authServices: AuthServices) {
    this.router = express.Router();
    this.router.post('/login', this.login);
  }

  login = async (req: express.Request<unknown, LoginData>, res: express.Response) => {
    const loginData = req.body;
    const [data, error] = await to(login.parseAsync(loginData));
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    this.authServices
      .login(data.email, data.password)
      .then((token) => {
        return res.status(200).json({ token });
      })
      .catch((error: ErrorType) => {
        return res.status(error.status).json(error);
      });
  };

  public getRouter() {
    return this.router;
  }
}

export const authRouter = () => {
  const db = firestoreDB();
  const usersepository = new UsersRepository(db, 'users');
  const usersServices = new UserService(usersepository);
  const jwt = new JWT(usersServices);
  const authServices = new AuthServices(usersServices, jwt);
  const router = new AuthRouter(authServices);
  return router.getRouter();
};
