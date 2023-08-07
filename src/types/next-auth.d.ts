import { JwtAuthToken, User } from '../../generated';

interface ISessionUser extends User {
  token: JwtAuthToken;
}

declare module 'next-auth' {
  interface User extends ISessionUser {}

  interface Session {
    user: User;
    token: JwtAuthToken;
    error?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: ISessionUser;
  }
}
