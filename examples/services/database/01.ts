import { DatabaseService } from "../../../src/services/database/index.ts";
import type { Module, Post } from "../../../src/types/index.ts";

const dbSvc = new DatabaseService({
	url: "ws://localhost:8000",
	config: {
		access: "user",
		database: "test",
		namespace: "webslab",
	},
});

console.log("ready:", await dbSvc.isReady);
const db = dbSvc.getDb();

// it's not authenticated
console.log(await db.info());

// but it can still read the posts
console.log(await db.select<Post>("post"));
console.log(await db.select<Module>("module")); // unauthorized: []
