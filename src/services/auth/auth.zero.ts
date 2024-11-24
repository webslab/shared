import { AuthService } from "./auth.service.ts";

export class AuthZero extends AuthService {
	override signin(): Promise<boolean> {
		return Promise.resolve(true);
	}
}
