import { RecordId } from "surrealdb";

import type { SurrealDbError } from "surrealdb";
import type { AuthService } from "../auth/auth.service.ts";
import type { Module, Paper, Question, User } from "../../types/index.ts";

type Answer = {
	content: string;
	question: RecordId | Question;
};

type Action = {
	name: "start" | "next" | "prev" | "submit" | "answer";
	current?: number;
	time: Date;
};

export class PaperService implements Paper {
	// paper: Paper; // TODO: preffered
	actions: Action[] = [];
	answers: Answer[] = [];

	authSvc: AuthService;
	module: Module;
	user: User;

	constructor(module: Module, authSvc: AuthService) {
		this.authSvc = authSvc;
		this.module = module;
		this.user = this.authSvc.getUser()!;

		this.startPaper();
	}

	// throw "";
	public async submit(current: number, answers?: object[]): Promise<void> {
		if (answers?.length !== 0) {
			(answers as Answer[])?.forEach((answer) => {
				const question = answer.question.toString().split(":");

				this.answers.push({
					content: answer.content,
					question: new RecordId("question", question[1]),
				});
			});
		}

		this.actions.push({
			current,
			name: "submit",
			time: new Date(),
		});

		try {
			await this.save();
		} catch (e: unknown) {
			console.log(e);
		}
		// return error message in case
	}

	public answer(current: number, answer: Answer): void {
		this.answers.push(answer); // TODO: not used

		this.actions.push({
			current,
			name: "answer",
			time: new Date(),
		});
	}

	public next(current: number): void {
		// TODO: ?? answers
		this.actions.push({
			current,
			name: "next",
			time: new Date(),
		});
	}

	public prev(current: number): void {
		// TODO: ?? answers
		this.actions.push({
			current,
			name: "prev",
			time: new Date(),
		});
	}

	private startPaper(): void {
		this.actions.push({
			name: "start",
			time: new Date(),
		});
	}

	/**
	 * @throws {SurrealDbError} - error from the database */
	private async save(): Promise<void> {
		const prepare: Paper = {
			user: new RecordId("user", (this.user.id as string).split(":")[1]),
			// user: new StringRecordId(this.user.id!),
			module: this.module.id as RecordId,
			answers: this.answers,
			actions: this.actions,
		};

		try {
			// can't use create because it needs permissions for select
			// const res = await this.authSvc.getDb().create("paper", prepare);
			await this.authSvc
				.getDb()
				.query(
					`CREATE paper CONTENT { user: $user, module: $module, answers: $answers, actions: $actions };`,
					prepare,
				);
		} catch (e: unknown) {
			throw e as SurrealDbError;
		}
	}

	// private searchQuestions(): Answer[] {
	// 	if (!this.module.content) return [] as Answer[];
	//
	// 	return this.module
	// 		.content
	// 		.filter((content) => content.includes("<wl-question"))
	// 		.map((content) => {
	// 			const qid = content.match(/<wl-question.*qid="question:(.*)".*>/);
	//
	// 			if (qid) {
	// 				return {
	// 					content: "",
	// 					question: new RecordId("question", qid[1]),
	// 				};
	// 			}
	// 		})
	// 		.filter((question) => question !== undefined);
	// }
}
