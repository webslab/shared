import { customElement, property, query, state } from 'lit/decorators.js';
import { html, LitElement } from 'lit';
import type { CSSResultGroup, TemplateResult } from 'lit';
import { Task } from '@lit/task';

// @ts-types="@types/nunjucks"
import nunjucks from 'nunjucks';

import styles from './table.style.ts';
import componentStyles from '../styles.ts';

@customElement('wl-table')
export class WlTable extends LitElement {
	static override styles: CSSResultGroup = [componentStyles, styles];

	@property({ type: Boolean })
	accessor live: boolean = false;

	@property({ type: String })
	accessor query!: string;

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

	private task = new Task(this, {
		task: async ([query], _) => {
			await new Promise((resolve, reject) => setTimeout(resolve, 1000));

			const template = this.templateSlot
				.assignedElements()
				.map((el) => el as HTMLElement);

			const target = this.bodySlot
				.assignedElements()
				.map((el) => el as HTMLElement)[0]
				.querySelector(this.target)!;

			const rendered = nunjucks.renderString(
				template[0].innerHTML,
				{ result: this.data },
			);

			target.innerHTML = rendered;
		},
		args: () => [this.query],
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
		'wl-table': WlTable;
	}
}
