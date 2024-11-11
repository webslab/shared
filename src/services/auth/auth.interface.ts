// import type { Surreal } from 'surrealdb';
import type { User } from '../models/user.type.ts';
import type { IDatabaseService } from '../database/database.interface.ts';

export interface IAuthService extends IDatabaseService {
	// isReady: Promise<boolean>;
	signin(username?: string, password?: string, access?: string): Promise<boolean>;
	signup(user: User): Promise<boolean>;
	// getDb(): Surreal;
	isAuthenticated(): boolean;
	isAdministrator(): boolean;
}
