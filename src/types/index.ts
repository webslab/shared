import type { RecordId } from "surrealdb";

export type Analytic = {
	created?: Date | undefined;
	location: {
		[x: string]: unknown;
	};
	navigator: {
		[x: string]: unknown;
	};
	performance: {
		[x: string]: unknown;
	};
	user_id: (RecordId | User) | string;
	id?: string | RecordId | undefined;
};

export type Module = {
	author: RecordId | User;
	content: string[];
	created?: Date | undefined;
	hero: string;
	likes?: unknown;
	publish?: Date | undefined;
	slug?: string | undefined;
	title: string;
	updated?: Date | undefined;
	visits?: unknown;
	id?: string | RecordId | undefined;
};

export type Visits = {
	created?: Date | undefined;
	id?: string | RecordId | undefined;
	in: string | RecordId | User;
	out: string | RecordId | Post | Module;
};

export type Likes = {
	created?: Date | undefined;
	id?: string | RecordId | undefined;
	in: string | RecordId | User;
	out: string | RecordId | Post | Module;
};

export type User = {
	auth_until?: Date | undefined;
	email: string;
	name: string;
	password?: string | undefined;
	role?: string | undefined;
	username: string;
	id?: string | RecordId | undefined;
};

export type Post = {
	author: RecordId | User;
	content: string[];
	created?: Date | undefined;
	draft?: boolean | undefined;
	hero: string;
	likes?: unknown;
	publish?: Date | undefined;
	slug?: string | undefined;
	title: string;
	updated?: Date | undefined;
	visits?: unknown;
	id?: string | RecordId | undefined;
};
