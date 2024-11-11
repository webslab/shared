import { DatabaseService } from '../../src/services/database/index.ts';

const dbSvc = new DatabaseService({
	url: 'http://localhost:8000',
	config: {
		access: 'users',
		database: 'test',
		namespace: 'test',
	},
});

console.log('ready:', await dbSvc.isReady);
const db = dbSvc.getDb();

// it's not authenticated
console.log(await db.info());

// but it can still read the posts
console.log(await db.select('posts'));
