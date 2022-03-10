# @nhost/react-apollo

## 3.1.0

### Minor Changes

- 0d8afde: Use `@nhost/react` as a peer dependency
  `@nhost/react` was bundled where it shouldn't. As a result, `@nhost/react-apollo` did not have access to the Nhost React context, leading to errors

### Patch Changes

- Updated dependencies [0d8afde]
  - @nhost/apollo@0.2.1
  - @nhost/react@0.2.1

## 3.0.0

### Major Changes

- 207ae38: Rewrite of the Apollo GraphQL client

  - Introducing a new `@nhost/apollo` that will be reusable by other frameworks than React e.g. Vue
  - The new package works together with the `@nhost/client` and its new state management system
  - **BREACKING CHANGE** The react client `@nhost/react-apollo` is set to use the new `@nhost/client` package and won't work anymore with `@nhost/nhost-js`. See the [documentation](https://docs.nhost.io/reference/react/apollo) for further information.

  Closes [#8](https://github.com/nhost/nhost/issues/8)

### Patch Changes

- Updated dependencies [207ae38]
  - @nhost/apollo@0.2.0
  - @nhost/react@0.2.0

## 2.1.4

### Patch Changes

- c8f2488: optimize npm packages: only include the `dist` directory, and introduce the `exports` field in package.json as per Vite's recommendations.
- Updated dependencies [c8f2488]
  - @nhost/nhost-js@0.3.10

## 2.1.3

### Patch Changes

- Updated dependencies [2e1c055]
  - @nhost/nhost-js@0.3.9

## 2.1.2

### Patch Changes

- 03562af: Build in CommonJS and ESM instead of UMD and ESM as the UMD bundle generated by the default Vite lib build mode doesn't work with NodeJS
- Updated dependencies [03562af]
  - @nhost/nhost-js@0.3.8

## 2.1.1

### Patch Changes

- @nhost/nhost-js@0.3.7