import { WebslabElement } from '../webslab/index.ts';
import { customElement, property, query } from 'lit/decorators.js';
import { html } from 'lit';
import { Task } from '@lit/task';

// @ts-types="@types/nunjucks"
import nunjucks from 'nunjucks';

import type { Uuid } from 'surrealdb';
import type { CSSResultGroup, TemplateResult } from 'lit';
import type { IDatabaseService } from '../../services/database/database.interface.ts';
// import type { IAuthService } from '../../services/auth/index.ts';

import styles from './database.style.ts';
import componentStyles from '../styles.ts';

@customElement('wl-database')
export class WlDatabase extends WebslabElement {
	static override styles: CSSResultGroup = [componentStyles, styles];

	@property({ type: Boolean })
	accessor live: boolean = false;

	@property({ type: String })
	accessor query!: string;

	@property({ type: String })
	accessor target!: string;

	@property({ type: Object })
	accessor auth: IDatabaseService | undefined; // or something thtat implements isReady and getDb

	@query('slot[name="template"]')
	accessor templateSlot!: HTMLSlotElement;

	@query('slot')
	accessor bodySlot!: HTMLSlotElement;

	@query('.wrap')
	accessor wrap!: HTMLDivElement;

	private task = new Task(this, {
		task: async ([auth]) => {
			if (!auth) {
				this.emit('wl-task:error');
				return;
			}

			if (!await auth.isReady) {
				this.emit('wl-task:error');
				return;
			}

			const db = auth.getDb();
			const res: unknown[] = await db.query(this.query);

			const template = this.templateSlot
				.assignedElements()
				.map((el) => el as HTMLElement);

			const target = this.bodySlot
				.assignedElements()
				.map((el) => el as HTMLElement)[0]
				.querySelector(this.target)!;

			const rendered = nunjucks.renderString(
				template[0].innerHTML,
				{ result: res },
			);

			target.innerHTML = rendered;

			if (this.live) {
				try {
					const uuid: Uuid[] = await db.query('LIVE ' + this.query);
					await this.listenDb(uuid[0]);
				} catch (e) {
					console.error(e);
					this.emit('wl-task:error');
					throw e;
				}
			}

			this.emit('wl-task:completed');
		},
		args: () => [this.auth],
	});

	override render(): TemplateResult {
		// deno-fmt-ignore-start
		return html`
      <slot></slot>
      <slot name="template"></slot>
      ${this.task.render({
        pending: () => html`<div class="wrap"><p>Loading...</p></div>`,
        complete: () => html`<div><p>Complete</p></div>`,
        error: () => html`<div class="wrap"><p>Error</p></div>`,
      })}
    `;
		// deno-fmt-ignore-end
	}

	createItem(item: Record<string, unknown>) {
		const template = this.templateSlot
			.assignedElements()
			.map((el) => el as HTMLElement);

		const target = this.bodySlot
			.assignedElements()
			.map((el) => el as HTMLElement)[0]
			.querySelector(this.target)!;

		const rendered = nunjucks.renderString(
			template[0].innerHTML,
			{ result: [[item]] },
		);

		target.insertAdjacentHTML('beforeend', rendered);
	}

	// updates the item when it is possible.
	// the item must have an id and the target must have an element[data-id] with the same id.
	updateItem(item: Record<string, unknown>) {
		const template = this.templateSlot
			.assignedElements()
			.map((el) => el as HTMLElement);

		const target = this.bodySlot
			.assignedElements()
			.map((el) => el as HTMLElement)[0]
			.querySelector(this.target)!;

		if (item.id) {
			// if there are multiple items with the same id, do not update.
			if (target.querySelectorAll(`[data-id="${item.id}"]`).length > 1) return;

			const targetItem = target.querySelector(`[data-id="${item.id}"]`);

			if (targetItem) {
				const rendered = nunjucks.renderString(
					template[0].innerHTML,
					{ result: [[item]] },
				);

				targetItem.innerHTML = rendered;
			}
		}
	}

	deleteItem(item: Record<string, unknown>) {
		const target = this.bodySlot
			.assignedElements()
			.map((el) => el as HTMLElement)[0]
			.querySelector(this.target)!;

		if (item.id) {
			const targetItem = target.querySelector(`[data-id="${item.id}"]`);
			if (targetItem) {
				targetItem.remove();
			}
		}
	}

	async listenDb(uuid: Uuid) {
		const db = this.auth!.getDb();
		await db.subscribeLive(uuid, (action, item) => {
			switch (action) {
				case 'CLOSE':
					return;
				case 'CREATE':
					this.createItem(item);
					break;
				case 'UPDATE':
					this.updateItem(item);
					break;
				case 'DELETE':
					this.deleteItem(item);
					break;
				default:
					console.log('Unknown action', action);
			}

			this.emit(`wl-action:${action.toLowerCase()}`, { detail: { item } });
		});
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'wl-database': WlDatabase;
	}
}
