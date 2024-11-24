import type { IDatabaseService } from "../database/database.interface.ts";
import type { User } from "../../types/index.ts";

export interface IAuthService extends IDatabaseService {
	// isReady: Promise<boolean>;
	signin(username?: string, password?: string, access?: string): Promise<boolean>;
	signup(user: User): Promise<boolean>;
	// getDb(): Surreal;
	isAuthenticated(): boolean;
	isAdministrator(): boolean;
}
