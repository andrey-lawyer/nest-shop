import { User } from 'src/users/user.entity';

export class ITokenUser extends User {
  token: string;
}
