import { to } from '../../utils/to';
import { v4 as uuid } from 'uuid';
import { UsersRepository } from '../users/repository';
import { IAuth } from './interfaces';
import { UserService } from '../users/services';
import { encodeJWT } from '../../api/middlewares/jwt';

export class AuthServices implements IAuth {
  constructor(private usersServices: UserService) {}
  login = async (email: string, password: string): Promise<string> => {
    const user = await this.usersServices.findUserByEmail(email);
    const isPasswordCorrect = await this.usersServices.comparePassword(
      password,
      user.password
    );
    if (!isPasswordCorrect) {
      throw { message: 'bad request', status: 400 };
    }
    const token = await encodeJWT({ uid: user.id });
    return token;
  };
}
