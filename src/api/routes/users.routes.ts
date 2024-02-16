import express, { Request, Response } from 'express';
import { User, UserDTO } from '../../domains/users/models';
import { v4 as uuid } from 'uuid';
class UsersRouter {
  public router: express.Router;
  private users: User[] = [];
  constructor() {
    this.router = express.Router();
    this.router.get('/:id', this.getUserByID);
    this.router.post('/', this.createUser);
    this.router.delete('/:id', this.deleteUser);
    this.router.put('/:id', this.updateUser);
  }

  getUserByID = (req: Request, res: Response) => {
    const { id } = req.params;
    const [user] = this.users.filter((user) => user.id === id);
    return res.status(200).json(user);
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
    const user: User = {
      id,
      ...userDTO,
    };

    this.users = this.users.map((u) => (u.id === id ? user : u));
    return res.status(200).json(user);
  };

  public getRouter() {
    return this.router;
  }
}

export const usersRouter = () => {
  const router = new UsersRouter();
  return router.getRouter();
};
