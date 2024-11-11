import { AuthSurreal } from './auth.surreal.ts';
import { AuthZero } from './auth.zero.ts';

import type { IAuthService } from './auth.interface.ts';
import type { DbConfig } from '../database/index.ts';
import type { Surreal } from 'surrealdb';

type AuthProvider = 'surreal' | 'auth0';

// NOTE: could be an union: AuthSurreal | AuthZero
export function getAuthService(
	db: DbConfig | Surreal,
	provider: AuthProvider = 'surreal',
	// ): IAuthService {
): AuthSurreal | AuthZero {
	if (provider !== 'surreal') {
		return new AuthZero(db);
	}

	return new AuthSurreal(db);
}
