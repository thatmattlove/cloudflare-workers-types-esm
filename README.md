<div align="center">
  <h1>Cloudflare Workers Types (ESM)</h1>
  <em>your automatic band-aid for using <a href="https://github.com/cloudflare/workers-types"><code>@cloudflare/workers-types</code></a> to ship Cloudflare Workers utilities and frameworks</em>
  <p>
    <a href="https://github.com/cloudflare/workers-types"><img alt="@cloudflare/workers-types current version" src="https://img.shields.io/npm/v/@cloudflare/workers-types?color=F48120&label=%40cloudflare%2Fworkers-types&logo=cloudflare&style=for-the-badge"></a>
    <a href="#"><img alt="cloudflare-workers-types-esm current version" src="https://img.shields.io/npm/v/cloudflare-workers-types-esm?color=003682&label=cloudflare-workers-types-esm&style=for-the-badge"></a>
  </p>
  <p>
    <a href="https://github.com/thatmattlove/cloudflare-workers-types-esm/actions/workflows/quality.yml"><img alt="Quality Tests" src="https://img.shields.io/github/actions/workflow/status/thatmattlove/cloudflare-workers-types-esm/quality.yml?branch=main&label=Tests&style=for-the-badge"></a>
    <a href="https://github.com/thatmattlove/cloudflare-workers-types-esm/actions/workflows/build.yml"><img alt="Build" src="https://img.shields.io/github/actions/workflow/status/thatmattlove/cloudflare-workers-types-esm/build.yml?branch=main&label=Build&style=for-the-badge"></a>
  </p>
</div>

---
⚠️ After the release of [`@cloudflare/workers-types`](https://github.com/cloudflare/workers-types), this project is (thankfully) no longer necessary.
---

If you're like me, you might think to yourself, "hey I could totally make this library that others and I can re-use when building Cloudflare Workers", and you get all the way to the end, go to test it, and see everybody's favorite TypeScript error:

<div align="center">
  <p>
	  <img src="https://res.cloudinary.com/hyperglass/image/upload/v1664200977/Screen_Shot_2022-09-26_at_10.01.26_mc7wgw.png">
  </p>
</div>

This happens because the [`@cloudflare/workers-types`](https://github.com/cloudflare/workers-types) package doesn't export its type definitions; which is why you need to reference them in your project's `tsconfig.json` file as global types.

[Issue #195](https://github.com/cloudflare/workers-types/issues/195) has been opened to fix this, but because there is no timeline for completion and no ability to submit a PR (the type definitions are automatically generated), I created this package as a stopgap.

## Installation

```bash
# NPM
npm install cloudflare-workers-types-esm
# Yarn
yarn add cloudflare-workers-types-esm
# PNPM
pnpm install cloudflare-workers-types-esm
```

## Usage

Import (or export) the types as needed

```ts
import { KVNamespace } from "cloudflare-workers-types-esm";

export type MySpecialSnowflake = KVNamespace<string>;
```

## Updates

`cloudflare-workers-types-esm` is automagically kept in sync with `@cloudflare/workers-types` with a GitHub Action workflow that runs hourly. When Cloudflare releases a new version of their type definitions, `cloudflare-workers-types-esm` will be updated to match it within an hour or so. That way, you don't have to wait on some unreliable maintainer to do stuff for you 👀

## License

[This package is subject to the license of the original `@cloudflare/workers-types` package](https://github.com/cloudflare/workers-types/blob/master/LICENSE)
