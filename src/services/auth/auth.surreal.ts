import { AuthService } from "./auth.service.ts";
import type { User } from "../../types/index.ts";

export class AuthSurreal extends AuthService {
	override async signin(username: string, password: string, access?: string) {
		const db = this.databaseService.getDb();

		if (await this.isReady) {
			if (!access) {
				if (!this.databaseService.dbConfig) {
					Promise.reject("Access not provided");
					return Promise.resolve(false);
				}

				if (!this.databaseService.dbConfig.config.access) {
					Promise.reject("Access not provided");
					return Promise.resolve(false);
				}

				access = this.databaseService.dbConfig.config.access;
			}

			// at this point surreal could throw an error
			try {
				const token = await db.signin({
					access,
					variables: { username, password },
				});

				this.setToken(token);
				db.authenticate(token);
			} catch (e) {
				// console.error(e);

				Promise.reject("Access denied: " + e);
				return Promise.resolve(false);
			}

			const user = await db.info<User>();

			if (!user || !user.id) {
				// If no user info returned or user is invalid, clear authentication
				this.clearAuth();
				Promise.reject("Access denied");
				return Promise.resolve(false);
			} else {
				this.setUser(user);
				return Promise.resolve(true);
			}
		}

		Promise.reject("Service not ready");
		return Promise.resolve(false);
	}
}
