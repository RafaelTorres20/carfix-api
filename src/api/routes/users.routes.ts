import express, { Request, Response } from 'express';import { User, UserDTO } from '../../domains/users/models';
import { v4 as uuid } from 'uuid';
import { UserService } from '../../domains/users/services';
import { FirestoreDB } from '../../gateways/firestore/db';
import { ErrorType } from '../../errors/types';
class UsersRouter {
  public router: express.Router;
  private users: User[] = [];
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
    const user: User = {
      id: uuid(),
      ...userDTO,
    };

    this.users.push(user);
    return res.status(201).json({ id: user.id });
  };

  deleteUser = (req: Request, res: Response) => {
    const { id } = req.params;
    this.users = this.users.filter((user) => user.id !== id);
    return res.status(204).send();
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
  const db = new FirestoreDB().firestoreDB;
  const usersService = new UserService(db);
  const router = new UsersRouter(usersService);
  return router.getRouter();
};
