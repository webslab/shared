/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2023 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

// TODO: refactorize
// export function initThemingService() {}
// export function initThemeSwitcher(selector: string) {}

export function initThemeSwitcher(selector: string) {
	'use strict';

	const getStoredTheme = (): string | null => localStorage.getItem('theme');
	const setStoredTheme = (theme: string | null): void => {
		if (!theme) {
			localStorage.removeItem('theme');
			return;
		}

		localStorage.setItem('theme', theme);
	};

	const getPreferredTheme = (): string => {
		const storedTheme = getStoredTheme();
		if (storedTheme) {
			return storedTheme;
		}

		return globalThis.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	};

	const setTheme = (theme: string | null): void => {
		if (!theme) return;

		if (theme === 'auto') {
			document.documentElement.setAttribute(
				'data-bs-theme',
				globalThis.matchMedia('(prefers-color-scheme: dark)').matches
					? 'dark'
					: 'light',
			);
		} else {
			document.documentElement.setAttribute('data-bs-theme', theme);
		}
	};

	setTheme(getPreferredTheme());

	const showActiveTheme = (theme: string | null, focus = false): void => {
		if (!theme) {
			return;
		}

		const themeSwitcher: HTMLElement | null = document.querySelector(selector);

		if (!themeSwitcher) {
			return;
		}

		// const themeSwitcherText = document.querySelector("#bd-theme-text");
		// const activeThemeIcon = document.querySelector(".theme-icon-active use");
		const btnToActive = document.querySelector(
			`[data-bs-theme-value="${theme}"]`,
		);
		// const svgOfActiveBtn = btnToActive.querySelector("svg use").getAttribute(
		//   "href",
		// );

		document.querySelectorAll('[data-bs-theme-value]').forEach((element) => {
			element.classList.remove('active');
			element.setAttribute('aria-pressed', 'false');
		});

		if (btnToActive) {
			btnToActive.classList.add('active');
			btnToActive.setAttribute('aria-pressed', 'true');
		}

		// activeThemeIcon.setAttribute("href", svgOfActiveBtn);

		// const themeSwitcherLabel =
		//   `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`;
		// themeSwitcher.setAttribute("aria-label", themeSwitcherLabel);

		if (focus) {
			themeSwitcher.focus();
		}
	};

	globalThis.matchMedia('(prefers-color-scheme: dark)').addEventListener(
		'change',
		() => {
			const storedTheme = getStoredTheme();
			if (storedTheme !== 'light' && storedTheme !== 'dark') {
				setTheme(getPreferredTheme());
			}
		},
	);

	globalThis.addEventListener('DOMContentLoaded', () => {
		showActiveTheme(getPreferredTheme());

		document.querySelectorAll('[data-bs-theme-value]').forEach((toggle) => {
			toggle.addEventListener('click', () => {
				const theme = toggle.getAttribute('data-bs-theme-value');

				setStoredTheme(theme);
				setTheme(theme);
				showActiveTheme(theme, true);
			});
		});
	});
}
