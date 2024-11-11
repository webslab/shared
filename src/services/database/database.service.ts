import { Surreal } from 'surrealdb';

export type DbConfig = {
	url: string;
	config: {
		access: string; // be careful in case optional: atuh.surreal.ts
		database: string;
		namespace: string;
	};
};

export class DatabaseService {
	private db?: Surreal;
	// private token?: string;
	private _isReady: boolean = false;

	public dbConfig?: DbConfig;
	public isReady: Promise<boolean>;

	constructor(db: DbConfig | Surreal /**, token?: string */) {
		// this.token = token;

		if (db instanceof Surreal) {
			this.db = db;

			this._isReady = true;
			this.isReady = Promise.resolve(true);
		} else {
			this.isReady = this.initialize(db);
		}
	}

	private async initialize(dbConfig: DbConfig): Promise<boolean> {
		this.db = new Surreal();
		this.dbConfig = dbConfig;

		try {
			await this.db.connect(dbConfig.url, {
				...dbConfig.config,
				// prepare: async (db: Surreal) => {
				// 	if (this.token) {
				// 		// could fail if the token is invalid, expired
				// 		await db.authenticate(this.token);
				// 	}
				//
				// 	this._isReady = true;
				// },
			});

			this._isReady = true;
			return true;
		} catch (error) {
			console.error('Failed to connect to database:', error);
			// Promise.reject(error);
			throw error;
		}
	}

	/**
	 * @returns The Surreal database instance
	 * @throws {Error} If the database is not ready yet
	 */
	public getDb(): Surreal {
		if (!this.db || !this._isReady) {
			throw new Error('Database is not ready yet');
		}

		return this.db;
	}
}
