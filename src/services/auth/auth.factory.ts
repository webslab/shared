import { AuthSurreal } from "./auth.surreal.ts";
import { AuthZero } from "./auth.zero.ts";

import type { DbConfig } from "../database/index.ts";
import type { Surreal } from "surrealdb";

export const AuthProvider = ["surreal", "auth0"] as const;

type ReturnType = AuthSurreal | AuthZero;
type DbType = DbConfig | Surreal;

export function getAuthService(db: DbType, provider: typeof AuthProvider[number]): ReturnType {
	switch (provider) {
		case AuthProvider[1]:
			return new AuthZero(db);
		case AuthProvider[0]:
		default:
			return new AuthSurreal(db);
	}
}
