[![Build Status](https://travis-ci.org/YaaS/docpad-skeleton-apidocs.svg?branch=master)](https://travis-ci.org/YaaS/docpad-skeleton-apidocs)

## Quick try out in terminal

1. Run this command in the terminal: `git clone https://github.com/YaaS/docpad-skeleton-apidocs.git`
2. Open the cloned project: `cd docpad-skeleton-apidocs`
3. Call the following commands:
 * `npm run prepare`
 * `npm run init` -> to load the currently-integrated sample data
 * `npm run start`
4. Open this page: http://localhost:9778/

## Quick try out with Docker

1. Start the container in the terminal: `docker run -it --rm --name api-doc-sample -p 9778:9778 derberg/dsa-quickstart /bin/bash`
2. Start the documentation portal with sample data in it: `npm run start`
3. Open this page: http://localhost:9778/

## Using locally

If you called `npm run prepare` at least once, it means all the dependencies you need are installed. Now you can just start generation and the server with the following command: `npm run start`.

### Production

To trigger generation with production configuration:

1. Call the following commands: `npm run init ` and `npm run prepare-deploy`
2. Notice the new **out** folder. This folder contains all generated files and you can use them in production. For example, you can copy the contents of the **out** folder to your [GitHub Pages repository](https://pages.github.com/).

To push generated documentation to your repository, run:

```bash
npm run preparePushResult && npm run pushResult
```

### Tutorial

Start using this documentation template by following these tutorials:

- [Overview](docs/overview.md)
- [Prerequisites](docs/prerequisites.md)
- [Set up and publishing](docs/using_docu_tool.md)
- [Quick start with Docker](docs/using_docker.md)

Automate your documentation builds by following [Set up documentation continuous delivery pipeline](docs/automation.md).
