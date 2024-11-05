import { customElement, property, query } from 'lit/decorators.js';
import { html, LitElement } from 'lit';
import type { CSSResultGroup, TemplateResult } from 'lit';
import { Task } from '@lit/task';

import styles from './security.style.ts';
import componentStyles from '../styles.ts';

import type { AuthService } from '../../services/auth/index.ts';

@customElement('wl-security')
export class WlSecurity extends LitElement {
	static override styles: CSSResultGroup = [componentStyles, styles];

	@query('.wrap')
	accessor wrap!: HTMLDivElement;

	@property({ type: Object })
	accessor auth: AuthService | undefined;

	private task = new Task(this, {
		task: async ([auth], _) => {
			await auth?.isReady;
			return auth?.isAuthenticated();
		},
		args: () => [this.auth],
	});

	override render(): TemplateResult {
		// deno-fmt-ignore-start
		return html`
      <slot name="content"></slot>
      <div class="wrap">
        ${
          this.task.render({
            pending: () => html`<p>Pending</p>`,
            complete: (result) =>
              html`<h4>${result ? "Authenticated" : "Not authenticated"}</h4>`,
          })
        }
      </div>
    `;
		// deno-fmt-ignore-end
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'wl-security': WlSecurity;
	}
}
