import { DatabaseService } from "../database/index.ts";

import type { DbConfig } from "../database/index.ts";
import type { IAuthService } from "./auth.interface.ts";
import type { Surreal } from "surrealdb";
import type { User } from "../../types/index.ts";

export abstract class AuthService implements IAuthService {
	protected databaseService: DatabaseService;

	private token?: string;
	private user?: User;

	public isReady: Promise<boolean>;

	constructor(db: DbConfig | Surreal) {
		this.user = localStorage.getItem("user")
			? JSON.parse(localStorage.getItem("user") as string) as User
			: undefined;

		this.token = localStorage.getItem("token") || undefined;

		this.databaseService = new DatabaseService(db);
		this.isReady = this.initialize();
	}

	// ?? should be abstract
	public signup(user: User): Promise<boolean> {
		console.log("signup", user);
		return Promise.resolve(true);
	}

	public logout() {
		this.clearAuth();
	}

	public isAuthenticated(): boolean {
		return !!this.token;
	}

	public isAdministrator(): boolean {
		return this.user?.role === "admin";
	}

	public getDb(): Surreal {
		return this.databaseService.getDb();
	}

	public getWsDb(): Promise<Surreal> {
		return this.databaseService.getWsDb(this.getToken());
	}

	public getToken(): string | undefined {
		return this.token;
	}

	public getUser(): User | undefined {
		return this.user;
	}

	public getRandUser(): { id: string } {
		const randUser = JSON.parse(
			localStorage.getItem("randUser") || "null",
		) as { id: string } | null;

		if (randUser) {
			return { id: randUser.id };
		} else {
			const randomId = Math.random().toString(36).substring(7);
			const user = { id: `user:${randomId}` };

			localStorage.setItem("randUser", JSON.stringify(user));

			return user;
		}
	}

	abstract signin(username?: string, password?: string, access?: string): Promise<boolean>;

	private async initialize(): Promise<boolean> {
		try {
			await this.databaseService.isReady;

			if (this.token) {
				try {
					await this.databaseService.getDb().authenticate(this.token);
				} catch (_) {
					// console.error(_);
					this.clearAuth();
				}
			}

			return true;
		} catch (_) {
			// console.error(_);
			return false;
		}
	}

	protected setToken(token: string) {
		this.token = token;
		localStorage.setItem("token", token);
	}

	protected clearToken() {
		this.token = undefined;
		localStorage.removeItem("token");
	}

	protected setUser(user: User) {
		this.user = user;
		localStorage.setItem("user", JSON.stringify(user));
	}

	protected clearUser() {
		this.user = undefined;
		localStorage.removeItem("user");
	}

	protected clearAuth() {
		this.clearToken();
		this.clearUser();
	}
}
