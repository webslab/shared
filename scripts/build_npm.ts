import { build, emptyDir } from "jsr:@deno/dnt";

import denoPkg from "../deno.json" with { type: "json" };
import nodePkg from "../package.json" with { type: "json" };

await emptyDir("./npm");

const exports = Object.entries(denoPkg.exports).map(([name, path]) => ({ name, path }));
await build({
	entryPoints: [
		...exports,
	],

	outDir: "./npm",

	shims: {
		// see JS docs for overview and more options
		deno: true,
	},

	typeCheck: "both",
	compilerOptions: {
		lib: ["DOM"],
	},

	package: {
		// package.json properties
		name: denoPkg.name,
		version: denoPkg.version,
		description: "Your package.",
		license: denoPkg.license,
		dependencies: nodePkg.dependencies,
		repository: {
			type: "git",
			url: "git+https://github.com/webslab/shared.git",
		},
		// bugs: {
		// 	url: "https://github.com/username/repo/issues",
		// },
	},

	postBuild() {
		// steps to run after building and before running the tests
		// Deno.copyFileSync("LICENSE", "npm/LICENSE");
		Deno.copyFileSync("README.md", "npm/README.md");
	},
});
