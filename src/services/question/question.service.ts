import { StringRecordId } from "surrealdb";
import type { RecordId, Surreal } from "surrealdb";

import type { Question } from "../../types/index.ts";

export abstract class QuestionService {
	db: Surreal;

	constructor(db: Surreal) {
		this.db = db;
	}

	protected async byId(id: RecordId | string): Promise<Question | undefined> {
		return await this.db.select<Question>(new StringRecordId(id));
	}

	protected async updateCreate(question: Question): Promise<Question | void> {
		if (!question.id || question.id === "" || question.id === "undefined") {
			delete question.id;

			return (await this.db.create<Question>("question", question))[0];
		}

		const _id = new StringRecordId(question.id);
		// delete (question.id); // TODO: ?? better
		question.id = undefined;

		return (await this.db.update<Question>(_id, question));
	}

	abstract edit(question: Question): Promise<Question | void>;
}
