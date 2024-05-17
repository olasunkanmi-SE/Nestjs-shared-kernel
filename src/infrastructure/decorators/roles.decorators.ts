import { SetMetadata } from '@nestjs/common';
import { Role, ROLE_KEY } from '../common/constants';

export const Roles = (...role: Role[]) => SetMetadata(ROLE_KEY, role);
