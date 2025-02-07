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

export type Grants = {
	created?: Date | undefined;
	allocator: RecordId | User;
	id?: string | RecordId | undefined;
	in: RecordId | User;
	out: RecordId | Module;
};

export type Likes = {
	created?: Date | undefined;
	id?: string | RecordId | undefined;
	in: RecordId | User;
	out: RecordId | Post | Module;
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

export type Paper = {
	user: RecordId | User;
	module: RecordId | Module;
	answers?: {
		content?: string | undefined;
		question: RecordId | Question;
	}[] | undefined;
	actions?: {
		name: string;
	}[] | undefined;
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

export type Question = {
	content: string;
	type: string;
	range?: {
		hold?: number | undefined;
		min: number;
		max: number;
		spelled?: string[] | undefined;
	} | undefined;
	text?: {
		hold?: string | undefined;
		max?: number | undefined;
	} | undefined;
	id?: string | RecordId | undefined;
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

export type Visits = {
	created?: Date | undefined;
	id?: string | RecordId | undefined;
	in: RecordId | User;
	out: RecordId | Post | Module;
};
