import { to } from '../../utils/to';import { User, UserDTO, userDTO, user } from './models';
import { UsersRepository } from './repository';
import { v4 as uuid } from 'uuid';
import { compare, genSalt, hash } from 'bcrypt';
import { jwt } from '../../api/middlewares/jwt';
import { ZodError } from 'zod';

export class UserService {
  constructor(private usersRepository: UsersRepository) {}

  async hashPassword(password: string): Promise<string> {
    if (password === '') {
      console.log('password is empty');
      throw { message: 'bad request', status: 400 };
    }
    try {
      const salt = await genSalt(10);
      const hashPass = await hash(password, salt);
      return hashPass;
    } catch (err) {
      console.log(err);
      throw { message: 'Internal server error', status: 500 };
    }
  }

  async jwtExists(token: string): Promise<boolean> {
    const [user, error] = await to(this.usersRepository.findBy('jwt', token));
    if (error) {
      console.log(error);
      throw { message: 'internal server error', status: 500 };
    }
    return user?.jwt === token;
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    if (password === '' || hash === '') {
      console.log('password or hash is empty');
      throw { message: 'bad request', status: 400 };
    }
    const [result, error] = await to(compare(password, hash));
    if (error) {
      console.log(error);
      throw { message: 'Internal server error', status: 500 };
    }
    return result;
  }

  findUserByEmail = async (email: string): Promise<User> => {
    const [user, error] = await to(this.usersRepository.findBy('email', email));
    if (error) {
      console.log(error);
      throw { message: error.message, status: error.status };
    }
    return user;
  };

  async findUserByID(id: string): Promise<User> {
    this.usersRepository.verifyID(id);
    const user = await this.usersRepository.findBy('id', id);
    return user;
  }

  async updateUserByID(id: string, user: UserDTO): Promise<User> {
    this.usersRepository.verifyID(id);
    const [u, error] = await to<UserDTO, ZodError>(userDTO.parseAsync(user));
    if (error) {
      console.log(error);
      throw { message: 'bad request', status: 400 };
    }
    return await this.usersRepository.update('id', id, u);
  }

  async createUser(user: UserDTO): Promise<any> {
    const id = uuid();
    const [u, error] = await to(userDTO.parseAsync(user));
    if (error) {
      console.log(error);
      throw { message: 'bad request', status: 400 };
    }
    const hashPass = await this.hashPassword(u.password);
    const token = await jwt().encodeJWT({ uid: id });
    const newUser: User = { ...u, id, password: hashPass, jwt: token };
    await this.usersRepository.create(newUser);
    return { id };
  }

  async deleteUserByUserID(userID: string): Promise<any> {
    this.usersRepository.verifyID(userID);
    return await this.usersRepository.delete('id', userID);
  }
}
