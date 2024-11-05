export interface IAuthService {
	isAuthenticated(): boolean;
}

// mixin class, with authS and authZ, both should implement IAuthService
// authS: surrealdb authentification
// authZ: auth0 authentification

export class AuthService {
	isReady: Promise<boolean>;

	constructor() {
		this.isReady = new Promise((resolve) => {
			setTimeout(() => {
				resolve(true);
			}, 1000);
		});
	}

	isAuthenticated(): boolean {
		if (!this.isReady) return false;
		// do something

		return true;
	}
}
