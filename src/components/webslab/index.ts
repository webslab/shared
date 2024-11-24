import { LitElement } from "lit";

export class WebslabElement extends LitElement {
	emit<T extends string>(name: T, options?: CustomEventInit): CustomEvent<T> {
		const event = new CustomEvent(name, {
			bubbles: true,
			cancelable: false,
			composed: true,
			detail: {},
			...options,
		});

		this.dispatchEvent(event);
		return event as CustomEvent<T>;
	}
}
