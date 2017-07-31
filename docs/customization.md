# Customization of the landing page

To enable customization of the landing page, run `npm run init` as follows

```
customizationDirPath='./customization' npm run init -- -t 'services:exampleService'
```

**customizationDirPath** - a path to customization directory, which should consists of `index.html.eco` file.

Thanks to that **skeleton-apidocs** will be generated within new landing page located at **customizationDirPath**,
