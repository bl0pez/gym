import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/generated/prisma/enums';

export const META_ROLES = 'roles';

// @RoleProtected(Role.ADMIN, Role.USER)
export const RoleProtected = (...args: Role[]) => SetMetadata(META_ROLES, args);
