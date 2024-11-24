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
	user_id: string | {
		id: string;
		table: string;
	} | User;
	id?:
		| (string | {
			id: string;
			table: string;
		})
		| undefined;
};

export type Module = {
	author: string | {
		id: string;
		table: string;
	} | User;
	content: string;
	created?: Date | undefined;
	hero: string;
	likes?: unknown;
	publish?: Date | undefined;
	slug?: string | undefined;
	title: string;
	updated?: Date | undefined;
	visits?: unknown;
	id?:
		| (string | {
			id: string;
			table: string;
		})
		| undefined;
};

export type Visits = {
	created?: Date | undefined;
	id?:
		| (string | {
			id: string;
			table: string;
		})
		| undefined;
	in:
		| {
			id: string;
			table: string;
		}
		| string
		| User;
	out:
		| {
			id: string;
			table: string;
		}
		| string
		| Post
		| Module;
};

export type Likes = {
	created?: Date | undefined;
	id?:
		| (string | {
			id: string;
			table: string;
		})
		| undefined;
	in:
		| {
			id: string;
			table: string;
		}
		| string
		| User;
	out:
		| {
			id: string;
			table: string;
		}
		| string
		| Post
		| Module;
};

export type User = {
	auth_until?: Date | undefined;
	email: string;
	name: string;
	password?: string | undefined;
	role?: string | undefined;
	username: string;
	id?:
		| (string | {
			id: string;
			table: string;
		})
		| undefined;
};

export type Post = {
	author: string | {
		id: string;
		table: string;
	} | User;
	content: string;
	created?: Date | undefined;
	hero: string;
	likes?: unknown;
	publish?: Date | undefined;
	slug?: string | undefined;
	title: string;
	updated?: Date | undefined;
	visits?: unknown;
	id?:
		| (string | {
			id: string;
			table: string;
		})
		| undefined;
};
