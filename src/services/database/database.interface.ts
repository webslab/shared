import type { Surreal } from 'surrealdb';

export interface IDatabaseService {
	isReady: Promise<boolean>;
	getDb(): Surreal;
}
