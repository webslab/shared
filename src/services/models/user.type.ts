import type { RecordId } from 'surrealdb';

export type User = {
	id?: RecordId;

	name: string;
	role?: string;
	email: string;
	authUntil: string;

	username: string;
	password?: string;
};
