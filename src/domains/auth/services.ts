import { to } from '../../utils/to';
import { v4 as uuid } from 'uuid';
import { UsersRepository } from '../users/repository';
import { IAuth } from './interfaces';
import { UserService } from '../users/services';
import { JWT } from '../../api/middlewares/jwt';

export class AuthServices implements IAuth {
  constructor(private usersServices: UserService, private jwt: JWT) {}
  login = async (
    email: string,
    password: string
  ): Promise<{ token: string; email: string; id: string; name: string }> => {
    const user = await this.usersServices.findUserByEmail(email);
    const isPasswordCorrect = await this.usersServices.comparePassword(
      password,
      user.password
    );
    if (!isPasswordCorrect) {
      console.log('password is incorrect');
      throw { message: 'bad request', status: 400 };
    }
    const token = await this.jwt.encodeJWT({ uid: user.id });
    const [, error] = await to(
      this.usersServices.updateUserByID(user.id, { ...user, jwt: token })
    );
    if (error) {
      throw { message: 'internal server error', status: 500 };
    }
    return { token, email: user.email, id: user.id, name: user.name };
  };
}
