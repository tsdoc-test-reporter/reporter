# Contributing to @tsdoc-test-reporter

A big welcome and thank you for considering contributing to _@tsdoc-test-reporter_!

Reading and following these guidelines will help us make the contribution process easy and effective for everyone involved. It also communicates that you agree to respect the time of the developers managing and developing these open source projects. In return, we will reciprocate that respect by addressing your issue, assessing changes, and helping you finalize your pull requests.

## Quicklinks

- [Getting Started](#getting-started)
  - [Issues](#issues)
  - [Pull Requests](#pull-requests)
  - [Local setup](#local-setup)
- [License](#license)

## Getting Started

Contributions are made to this repo via Issues and Pull Requests (PRs). If you are unsure about anything when contributing do not hesitate to open an Issue and ask what your next step should be.

### Issues

Issues should be used to report problems with the library, request a new feature, or to discuss potential changes before a PR is created.

If you find an Issue that addresses the problem you're having, please add your own reproduction information to the existing issue rather than creating a new one. Adding a [reaction](https://github.blog/2016-03-10-add-reactions-to-pull-requests-issues-and-comments/) can also help be indicating to our maintainers that a particular problem is affecting more than just the reporter.

### Pull Requests

PRs to the repository are always welcome and can be a quick way to get your fix or improvement slated for the next release. In general, PRs should:

- Only fix/add the functionality in question.
- Add tests for fixed or changed functionality (if a test suite already exists).

In general, we follow the ["fork-and-pull" Git workflow](https://github.com/susam/gitpr)

1. Fork the repository to your own Github account
2. Clone the project to your machine
3. Create a branch locally with a succinct but descriptive name
4. Be sure to lint and format before commiting (`pnpm format`, `pnpm lint`) and fix any issues that the linter finds.
5. Commit changes to the branch. We use [commitlint](https://github.com/conventional-changelog/commitlint) to check if your commit message follows [conventional commits format](https://www.conventionalcommits.org/en/v1.0.0/)
6. Push changes to your fork
7. Open a PR in our repository and follow the PR template so that we can efficiently review the changes.

## Local setup

1. Install pnpm ([instructions here on pnpm website](https://pnpm.io/installation))
2. Install dependencies with `pnpm`

```bash
pnpm install
```

3. Run the tests. This is the main way to test each package:

```bash
# test core
pnpm nx test core
# test jest
pnpm nx test jest
# test vitest
pnpm nx test vitest
```

Note that the `vitest`-package is setup to call itself when tests have been run with the default config. A HTML-report will be generated in the root folder of the project where you can view the output of the tests. This is only setup for Vitest as it is not right now technically possible to do the same for Jest.

### Testing built package locally

If you want to test the built package locally we have set up [nx:verdaccio](https://nx.dev/nx-api/js/executors/verdaccio) inside this repository. It means that you can publish a package locally and test it in another project.

1. Clone and setup the [Kitchen Sink Repository](https://github.com/tsdoc-test-reporter/kitchen-sink)
2. Start the local registry in this project.
```bash
pnpm nx local-registry
```
3. Make changes and bump the version of the package you want to test
4. Publish the package to the local registry. It will publish locally if Verdaccio is running. For example, the core package:
```bash
pnpm nx publish core
```
3. Visit the local registry in your browser at [`http://localhost:4873/`](http://localhost:4873/) to see that it is working. You should see the package you just published.
6. Install the new version you just published in the Kitchen Sink repository
7. Test the changes inside of the Kitchen Sink Repository.

### Testing the core renderer output

There is a test setup to output some example data for the renderer that can be viewed in a browser. Making it easier to test making changes to the HTML and CSS.

1. Run the test _"render example data"_ inside of `renderer.spec.ts`
```
pnpm nx test core --testFile=renderer.spec.ts --watch
```
2. A file called `example.html` will be generated inside of the same folder as the test
3. Open the file with your browser of choice to see the output

### Testing the parser on actual files instead of test data

There is a test setup to parse and test typescript files in the core package making it easier to test what the actual output is of an actual file.

1. Modify the file `test-file.ts` to handle your test data
2. Run the test _"test file"_ inside of `test-file.spec.ts`
```
pnpm nx test core --testFile=test-file.spec.ts --watch
```

### See output of Jest test result

Sometimes you might want to check the actual output of running a jest test. A script is setup to log the output of a test run in the Jest package:

1. Modify the file `test-output-spec.ts`
2. Run the script `test:jest` inside of the Jest package.
3. Check console output

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
