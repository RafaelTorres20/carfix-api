import { to } from '../../utils/to';
import { User, UserDTO, userDTO, user } from './models';
import { UsersRepository } from './repository';
import { v4 as uuid } from 'uuid';

export class UserService {
  constructor(private usersRepository: UsersRepository) {}
  verifyID(id: string): void {
    if (!id) {
      throw { message: 'id is required', status: 400 };
    }
    if (id.length !== 36) {
      throw { message: 'id is invalid', status: 400 };
    }
    if (typeof id !== 'string') {
      throw { message: 'id is invalid', status: 400 };
    }
  }
  async findUserByID(id: string): Promise<User> {
    this.verifyID(id);
    return await this.usersRepository.find(id);
  }

  async updateUserByID(id: string, user: UserDTO): Promise<User> {
    this.verifyID(id);
    const [u, error] = await to(userDTO.parseAsync(user));
    if (error) {
      throw { message: error.message, status: 400 };
    }
    return await this.usersRepository.update(id, u);
  }

  async createUser(user: UserDTO): Promise<any> {
    const id = uuid();
    const [u, error] = await to(userDTO.parseAsync(user));
    if (error) {
      throw { message: error.message, status: 400 };
    }
    const newUser = { ...u, id };
    return await this.usersRepository.create(newUser);
  }

  async deleteUserByUserID(userID: string): Promise<any> {
    this.verifyID(userID);
    return await this.usersRepository.delete(userID);
  }
}
