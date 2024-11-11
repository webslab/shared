import { getAuthService } from '$services/auth';
// import type { User } from '../../src/services/models/index.ts';

const auth = getAuthService({
	url: 'http://localhost:8000',
	config: {
		access: 'users',
		database: 'test',
		namespace: 'test',
	},
}, 'surreal');

console.log('ready:', await auth.isReady);

auth.logout();
if (!auth.isAuthenticated()) {
	console.log('signin:', await auth.signin('test', 'test'));
}

console.log('admin:', auth.isAdministrator());

const db = auth.getDb();
console.log(await db.info());
// console.log(await db.select<User>('users'));
