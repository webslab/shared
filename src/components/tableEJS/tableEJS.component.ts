import { customElement, property, query, state } from 'lit/decorators.js';
import { html, LitElement } from 'lit';
import type { CSSResultGroup, TemplateResult } from 'lit';
import { Task } from '@lit/task';

// @ts-types="@types/ejs"
import ejs from 'ejs/ejs.min.js';

import styles from './tableEJS.style.ts';
import componentStyles from '../styles.ts';

@customElement('wl-table-ejs')
export class WlTableEJS extends LitElement {
	static override styles: CSSResultGroup = [componentStyles, styles];

	@property({ type: String })
	accessor target!: string;

	@query('slot[name="template"]')
	accessor templateSlot!: HTMLSlotElement;

	@query('slot')
	accessor bodySlot!: HTMLSlotElement;

	@query('.wrap')
	accessor wrap!: HTMLDivElement;

	@state()
	accessor data: object[] = [
		{ id: 1, name: 'John Doe', age: 25 },
		{ id: 2, name: 'Jane Doe', age: 22 },
		{ id: 3, name: 'John Smith', age: 30 },
	];

	// TODO: probably unsafe.
	// - libraries like `he` we could avoid this
	// - https://www.npmjs.com/package/html-sloppy-escaper
	unEscape(htmlStr: string) {
		return htmlStr
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, "'")
			.replace(/&amp;/g, '&');
	}

	private task = new Task(this, {
		task: async () => {
			await new Promise((resolve, reject) => setTimeout(resolve, 1000));

			const template = this.templateSlot
				.assignedElements()
				.map((el) => el as HTMLElement)[0];

			const target = this.bodySlot
				.assignedElements()
				.map((el) => el as HTMLElement)[0]
				.querySelector(this.target)!;

			const unscaped = this.unEscape(template.innerHTML);
			target.innerHTML = await ejs.render(unscaped, { result: this.data }, {});
		},
		args: () => [],
	});

	override render(): TemplateResult {
		// deno-fmt-ignore-start
		return html`
      <slot></slot>
      <slot name="template"></slot>
      ${this.task.render({
        pending: () => html`<div class="wrap"><p>Loading...</p></div>`,
        complete: () => html`<div><p>Complete</p></div>`,
        error: () => html`<div><p>Error</p></div>`,
      })}
    `;
		// deno-fmt-ignore-end
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'wl-table-ejs': WlTableEJS;
	}
}
