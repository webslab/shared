import { WebslabElement } from "../webslab/index.ts";

import { customElement, property, query } from "lit/decorators.js";
import { html } from "lit";
import type { CSSResultGroup, TemplateResult } from "lit";

import componentStyles from "../styles.ts";
import styles from "./question.style.ts";

import type { Question } from "../../types/index.ts";
import type { QuestionService } from "../../services/index.ts";

@customElement("wl-question")
export class WlQuestion extends WebslabElement {
	static override styles: CSSResultGroup = [componentStyles, styles];

	question: Question | undefined;

	@property({ type: String, reflect: true })
	accessor qid: string | undefined;

	@property({ type: Boolean, reflect: true })
	accessor edit: boolean = false;

	@property({ type: Object })
	accessor actions!: QuestionService;
	// accessor actions!: { edit: (question: Question) => Promise<Question | void> };

	@query("#answer")
	accessor answer!: HTMLSpanElement;

	@query("slot[name=label]")
	accessor label!: HTMLSlotElement;

	@query("slot[name=input]")
	accessor input!: HTMLSlotElement;

	@query("slot[name=spelled]")
	accessor spelled!: HTMLSlotElement;

	constructor() {
		super();

		this.addEventListener("keydown", (e: KeyboardEvent) => {
			e.stopPropagation();
		});
	}

	override firstUpdated(): void {
		const input = this.input.assignedElements()[0] as HTMLInputElement;
		const content = (this.label.assignedElements()[0] as HTMLElement).innerText;

		let text;
		let range;

		const type = input.getAttribute("type")!;
		switch (type) {
			case "text":
				text = {
					hold: input.getAttribute("placeholder")!,
					max: parseInt(input.getAttribute("maxlength")!),
				};
				break;

			case "range":
				range = {
					min: parseInt(input.getAttribute("min")!),
					max: parseInt(input.getAttribute("max")!),
					hold: parseInt(input.getAttribute("value")!),
					spelled: Array
						.from(this.spelled.assignedElements()[0].children)
						.map((el) => (el as HTMLElement).innerText),
				};
				break;
		}

		// TODO: change the state on the firstUpdated method is not a good practice
		this.question = {
			id: this.qid,
			type,
			text,
			range,
			content,
		};
	}

	private updateQuestion(question: Question): void {
		const label = this.label.assignedElements()[0] as HTMLElement;
		const input = this.input.assignedElements()[0] as HTMLInputElement;
		const spelled = this.spelled.assignedElements()[0] as HTMLElement;

		this.question = undefined;
		this.question = question;

		// update id
		this.qid = question.id ? question.id.toString() : undefined;

		// update label
		label.innerText = this.question.content;

		// update input
		input.classList.remove("form-text", "form-range");
		input.classList.add(`form-${this.question.type}`);
		input.setAttribute("type", this.question.type);

		// update range
		if (this.question.type === "range" && this.question.range) {
			// this.question.text = undefined;

			input.setAttribute("min", this.question.range.min!.toString());
			input.setAttribute("max", this.question.range.max!.toString());
			input.setAttribute("value", this.question.range.hold!.toString());

			if (this.question.range.spelled) {
				spelled.innerHTML = this.question
					.range
					.spelled
					.map((el: string) => `<span>${el}</span>`)
					.join("");
			} else {
				if (!this.question.range.min || !this.question.range.max) return;

				const foo = [];
				for (let i = this.question.range.min; i <= this.question.range.max; i++) {
					foo.push(i.toString());
				}

				spelled.innerHTML = foo.map((el: string) => `<span>${el}</span>`).join("");
			}
		}

		// update text
		if (this.question.type === "text" && this.question.text) {
			// this.question.range = undefined;

			input.removeAttribute("value");

			input.setAttribute("placeholder", this.question.text.hold || "");
			input.setAttribute("maxlength", this.question.text.max?.toString() || "");
		}
	}

	private actionDelete(): void {
		if (!this.actions) return;

		this
			.actions
			.delete(this.question!);
	}

	private actionEdit(): void {
		if (!this.actions) return;

		this
			.actions
			.edit(this.question!)
			.then((question) => {
				if (question) this.updateQuestion(question);
			});
	}

	private editClose(): void {
		this.edit = !this.edit;
	}

	inputChange(e: Event): void {
		const input = e.target as HTMLInputElement;

		this.answer.innerText = input.value;
	}

	override render(): TemplateResult {
		return html`
      <slot name="label"></slot>
      <span
        id="answer"
        style="display: block; min-height: 1rem; text-align: center; font-weight: bold;"
      ></span>

      <slot name="input" @change=${this.inputChange}></slot>
      <slot name="spelled"></slot>

      <div class=${this.edit ? "edit" : "d-none"}>
          <div class="controls">
              <i style="margin-right: .3rem;" @click=${this.actionDelete}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                  </svg>
              </i>

              <i style="margin-right: .3rem;" @click=${this.actionEdit}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
                      <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
                      <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/>
                  </svg>
              </i>

              <i style="margin-right: .3rem;" @click=${this.editClose}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x-square" viewBox="0 0 16 16">
                      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                  </svg>
              </i>
          </div>
      </div>
  `;
	}
}
