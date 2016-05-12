# Simple API Docs Skeleton


### Locally

1. Navigate to the **apidocs** folder

2. Set up the registry path:
```
export REGISTRY_PATH = git_repository_with_registry
```
If **REGISTRY_PATH** is not given, then sample data will be used, in order to generate a sample documentation.

3. Run the following command:
```
npm start
```

4. Open `http://localhost:9778/` to see the results.

If you have already installed all npm packages and bower components, you can use `npm run local` instead of `npm start`. In this way you will omit running the following commands each time: `npm install` and `bower install`.

### Production

1. Navigate to the **apidocs** folder,

2. Set up the registry path:
```
export REGISTRY_PATH = git_repository_with_registry
```

3. Run the following command:
```
npm run production
```

4. In **apidocs** folder, find **out** folder. This folder contains all generated files and can be used on production. For example, you can copy the content of **out** folder to your [GitHub Pages repository](https://pages.github.com/).
