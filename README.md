[![Build Status](https://travis-ci.org/YaaS/docpad-skeleton-apidocs.svg?branch=master)](https://travis-ci.org/YaaS/docpad-skeleton-apidocs)

## Quick try out

1. Run in the console: `git clone https://github.com/YaaS/docpad-skeleton-apidocs.git`
2. Open cloned project: `cd docpad-skeleton-apidocs`
3. Call the following commands:
 * `npm run prepare`
 * `npm run init` -> to load currently integrated sample data
 * `npm run start`

## Using locally

If you called `npm run prepare` at least once, it means all the dependencies you needed got installed. Now you can just start generation and server with the following command: `npm run start`.

### Production

To trigger generation with production configuration:

1. Call the following commands: `npm run init ` and `npm run compile`
2. Notice new **out** folder. This folder contains all generated files and can be used on production. For example, you can copy the content of **out** folder to your [GitHub Pages repository](https://pages.github.com/).
