## Quick try out

1. Run in the console: `git clone https://github.com/hybris/docpad-skeleton-apidocs.git`
2. Open cloned project: `cd docpad-skeleton-apidocs`
3. Call the following command: `npm start`

## Using locally

If you called `npm start` at least ones, it means all the dependencies you needed got installed. Now you can just start generation and server with the following command: `npm run local`.

### Production

To trigger generation with production configuration:
1. Call the following command: `npm run production`
2. Notice new **out** folder. This folder contains all generated files and can be used on production. For example, you can copy the content of **out** folder to your [GitHub Pages repository](https://pages.github.com/).

### Updating

1. All your changes in this repository will be deleted, make sure you saved them somewhere
2. Make sure there are no changes in this repository's source code because git will try to pull all changes. (consider placing your registry outside of Dev Portal repository)
3. Call the following command: `npm run update`
