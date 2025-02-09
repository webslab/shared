import { RecordId } from "surrealdb";

import type { AuthService } from "../auth/auth.service.ts";
import type { Module, Paper, Question, User } from "../../types/index.ts";

type Answer = {
	content: string;
	question: RecordId | Question;
};

type Action = {
	name: "start" | "next" | "prev" | "finish";
	current?: number;
	time: Date;
};

export class PaperService implements Paper {
	actions: Action[] = [];
	answers: Answer[];

	authSvc: AuthService;
	module: Module;
	user: User;

	constructor(module: Module, authSvc: AuthService) {
		this.authSvc = authSvc;
		this.module = module;

		this.user = this.authSvc.getUser()!;
		this.answers = this.searchQuestions();

		this.startPaper();
	}

	// throw "";
	public async submit(current: number) {
		if (this.answers.length !== 0) {
			this.updateAnswers();
		}

		this.actions.push({
			current,
			name: "finish",
			time: new Date(),
		});

		try {
			await this.save();
		} catch (e: unknown) {
			console.log(e);
		}
		// return error message in case
	}

	public next(current: number) {
		this.actions.push({
			current,
			name: "next",
			time: new Date(),
		});
	}

	public prev(current: number) {
		this.actions.push({
			current,
			name: "prev",
			time: new Date(),
		});
	}

	private async save() {
		const prepare: Paper = {
			user: new RecordId("user", (this.user.id as string).split(":")[1]),
			// user: new StringRecordId(this.user.id!),
			module: this.module.id as RecordId,
			answers: this.answers,
			actions: this.actions,
		};
		console.log(prepare);

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
			throw e;
		}
	}

	private updateAnswers() {}

	private startPaper(): void {
		this.actions.push({
			name: "start",
			time: new Date(),
		});
	}

	private searchQuestions(): Answer[] {
		return this.module
			.content
			.filter((content) => content.includes("<wl-question"))
			.map((content) => {
				const qid = content.match(/<wl-question.*qid="question:(.*)".*>/);

				if (qid) {
					return {
						content: "",
						question: new RecordId("question", qid[1]),
					};
				}
			})
			.filter((question) => question !== undefined);
	}
}
