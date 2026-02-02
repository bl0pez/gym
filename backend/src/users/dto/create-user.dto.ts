export class CreateUserDto {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  googleId?: string;
  avatarUrl?: string;
}
