import { WebslabElement } from "../webslab/index.ts";
import { customElement, property, query } from "lit/decorators.js";
import { html } from "lit";
import { Task } from "@lit/task";

import styles from "./security.style.ts";
import componentStyles from "../styles.ts";

import type { CSSResultGroup, TemplateResult } from "lit";
import type { IAuthService } from "../../services/auth/index.ts";

export type Needs = {
	auth: boolean;
	admin: boolean;
};

@customElement("wl-security")
export class WlSecurity extends WebslabElement {
	static override styles: CSSResultGroup = [componentStyles, styles];

	@query(".wrap")
	accessor wrap!: HTMLDivElement;

	@query(".warning")
	accessor warning!: HTMLDivElement;

	@query('slot[name="warning"]')
	accessor warningSlot!: HTMLSlotElement;

	@property({ type: Object })
	accessor auth: IAuthService | undefined;

	@property({ type: Object })
	accessor needs: Needs = { auth: true, admin: true };

	private task = new Task(this, {
		task: async ([auth], _) => {
			if (!auth) {
				this.showWarning();
				this.emit("wl-task:error");
				return;
			}

			if (!await auth.isReady) {
				this.emit("wl-task:error");
				return;
			}

			if (!this.needs.auth) {
				// No authentication needed, but check if admin access is required
				if (this.needs.admin && !auth.isAdministrator()) {
					this.showWarning();
				} else {
					this.hideWarning();
				}
			} else {
				if (this.needs.admin && auth.isAdministrator()) {
					this.hideWarning();
				} else if (!this.needs.admin && auth.isAuthenticated()) {
					this.hideWarning();
				} else {
					this.showWarning();
				}
			}

			this.emit("wl-task:completed");
		},
		args: () => [this.auth],
	});

	override render(): TemplateResult {
		// deno-fmt-ignore-start
		return html`
      <slot name="content"></slot>
      <div class="wrap">
        <div class="warning hidden">
        ${
          this.task.render({
            pending: () => html`<p>Loading...</p>`,
            complete: (result: unknown) => {
              // return result ? html`<h4>Authenticated</h4>` : html`<h4>Not Authenticated</h4>`;
              return result
                ? html`<h4>Authenticated</h4>`
                : html`
                  <slot name="warning">
                    <h4>Warning</h4>
                    <p>Please login:</p>
                  </slot>`
            }
          })
        }
        </div>
      </div>
    `;
		// deno-fmt-ignore-end
	}

	showWarning() {
		this.warning.classList.remove("hidden");
	}

	hideWarning() {
		this.warning.classList.add("hidden");

		setTimeout(() => {
			this.wrap.style.opacity = "0";
		}, 10);

		setTimeout(() => {
			this.wrap.style.top = "-9999px";
			this.wrap.style.display = "none";
		}, Number(2) * 600);
		// }, Number(duration) * 500); // TODO: maybe increase the duration
	}
}

// TODO: avoid slow typing
// declare global {
// 	interface HTMLElementTagNameMap {
// 		"wl-security": WlSecurity;
// 	}
// }
