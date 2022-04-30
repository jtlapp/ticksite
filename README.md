# sveltekit-frontend-backend

A starter monorepo separating SvelteKit front-end and backend code, in TypeScript

NOTICE: This package is experimental prior to NPM release 1.0.0 and will continually evolve before then.

## Notes

Packages are in the `pkg/` folder, each with its own subfolder. To add a package, just add another subfolder and initialize it with `yarn init` or `pnpm init`. To create another svelte-kit installation, run `npm init svelte your-package-folder` from `pkg/`.

Run `pnpm install` from the root package to update dependencies in all packages.

# Details

I removed the following, may add later if it's a problem...

> I appended the following to `frontend/tsconfig.json` to pull in shared TypeScript:

```json
    "include": [
		"**/*.ts",
		"../shared/**/*.ts"
	]
```
