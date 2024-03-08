import express, { Request, Response } from 'express';
import { User, UserDTO } from '../../domains/users/models';
import { v4 as uuid } from 'uuid';
import { UserService } from '../../domains/users/services';
import { firestoreDB } from '../../gateways/firestore/db';
import { ErrorType } from '../../errors/types';
import { UsersRepository } from '../../domains/users/repository';
class UsersRouter {
  public router: express.Router;
  constructor(private usersService: UserService) {
    this.router = express.Router();
    this.router.get('/:id', this.getUserByID);
    this.router.post('/', this.createUser);
    this.router.delete('/:id', this.deleteUser);
    this.router.put('/:id', this.updateUser);
  }

  getUserByID = async (req: Request, res: Response) => {
    const { id } = req.params;
    this.usersService
      .findUserByID(id)
      .then((user) => {
        return res.status(200).json(user);
      })
      .catch((error: ErrorType) => {
        return res.status(error.status).json(error);
      });
  };

  createUser = (req: Request, res: Response) => {
    const userDTO: UserDTO = req.body;
    this.usersService
      .createUser(userDTO)
      .then((user) => {
        return res.status(201).json({ id: user.id });
      })
      .catch((error: ErrorType) => {
        return res.status(error.status).json(error);
      });
  };

  deleteUser = (req: Request, res: Response) => {
    const { id } = req.params;
    this.usersService
      .deleteUserByUserID(id)
      .then(() => {
        return res.status(204).send();
      })
      .catch((error: ErrorType) => {
        return res.status(error.status).json(error);
      });
  };

  updateUser = (req: Request, res: Response) => {
    const { id } = req.params;
    const userDTO: UserDTO = req.body;
    this.usersService
      .updateUserByID(id, userDTO)
      .then((user) => {
        return res.status(200).json(user);
      })
      .catch((error: ErrorType) => {
        return res.status(error.status).json(error);
      });
  };

  public getRouter() {
    return this.router;
  }
}

export const usersRouter = () => {
  const db = firestoreDB();
  const usersRepository = new UsersRepository(db, 'users');
  const usersService = new UserService(usersRepository);
  const router = new UsersRouter(usersService);
  return router.getRouter();
};
