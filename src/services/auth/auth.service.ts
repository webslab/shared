import { DatabaseService } from '../database/index.ts';

import type { IAuthService } from './auth.interface.ts';
import type { DbConfig } from '../database/index.ts';
import type { Surreal } from 'surrealdb';
import type { User } from '../models/user.type.ts';

export abstract class AuthService implements IAuthService {
	public isReady: Promise<boolean>;
	private user?: User;
	private token?: string = localStorage.getItem('token') || undefined;
	protected databaseService: DatabaseService;

	constructor(db: DbConfig | Surreal) {
		this.user = localStorage.getItem('user')
			? JSON.parse(localStorage.getItem('user') as string)
			: undefined;

		this.databaseService = new DatabaseService(db);
		this.isReady = this.initialize();
	}

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

	abstract signin(username?: string, password?: string, access?: string): Promise<boolean>;

	// ?? should be abstract
	public signup(user: User): Promise<boolean> {
		console.log('signup', user);
		return Promise.resolve(true);
	}

	public logout() {
		this.clearAuth();
	}

	public isAuthenticated(): boolean {
		return !!this.token;
	}

	public isAdministrator(): boolean {
		return this.user?.role === 'admin';
	}

	public getDb(): Surreal {
		return this.databaseService.getDb();
	}

	public getToken(): string | undefined {
		return this.token;
	}

	protected setToken(token: string) {
		this.token = token;
		localStorage.setItem('token', token);
	}

	protected clearToken() {
		this.token = undefined;
		localStorage.removeItem('token');
	}

	public getUser(): User | undefined {
		return this.user;
	}

	protected setUser(user: User) {
		this.user = user;
		localStorage.setItem('user', JSON.stringify(user));
	}

	protected clearUser() {
		this.user = undefined;
		localStorage.removeItem('user');
	}

	protected clearAuth() {
		this.clearToken();
		this.clearUser();
	}
}
