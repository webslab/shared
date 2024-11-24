import { getAuthService } from "../../src/services/auth/index.ts";
import type { User } from "../../src/types/index.ts";

const auth = getAuthService({
	url: "ws://localhost:8000",
	config: {
		access: "user",
		database: "test",
		namespace: "test",
	},
}, "surreal");

console.log("ready:", await auth.isReady);

auth.logout();
if (!auth.isAuthenticated()) {
	console.log("signin:", await auth.signin("test", "test"));
}

console.log("admin:", auth.isAdministrator());

const db = auth.getDb();
console.log(await db.info());
console.log(await db.select<User>("user"));
