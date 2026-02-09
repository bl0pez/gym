import { Role } from 'src/generated/prisma/enums';

export interface Payload {
  id: string;
  email: string;
  role: Role;
}
