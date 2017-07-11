## Configure the documentation publishing pipeline

To start the process, fork the projects specified in these instructions and configure them as shown to correctly to set up the documentation independent generation pipeline.

1. To fork the following repos, click each link and then click <b>[Fork](https://help.github.com/articles/fork-a-repo/)</b> in the top-right corner of each page:
 - API Doc portal template: https://github.com/YaaS/docpad-skeleton-apidocs
 - Sample REST API microservice to document: https://github.com/derberg/minerva
 - Sample registry that integrates the template and documentation sources: https://github.com/derberg/apidoc-workshop-docu_registry

2. Perform configuration using the commands shown. You can perform config edits through the Github.com UI or by using the [Git CLI](https://www.codeschool.com/courses/try-git) or [GitHub Desktop](https://help.github.com/desktop/guides/contributing/cloning-a-repository-from-github-to-github-desktop/).

 - Modify the <b>chewieConfig.js</b> file in the forked <b>docpad-skeleton-apidocs</b> repository. Change the <b>path<b> attribute to:
 ```
 path: process.env.REGISTRY_PATH || 'https://github.com/your_github_username/apidoc-workshop-docu_registry.git'
 ```
 - Modify the <b>minerva.json<b> file in the forked <b>apidoc-workshop-docu_registry</b> repository. Change the <b>location</b> attribute to:
 ```
 "location": "https://github.com/your_github_username/minerva"
 ```

## Start the API Doc portal locally

When you complete the configuration, follow these steps to start the API Doc portal locally. 

1. Clone your forked <b>docpad-skeleton-apidocs</b> repository.
2. Navigate to its local clone in the terminal.
3. Call the command `npm run prepare` to install all the dependencies.
4. Call `npm run init` to install and inject content into the template.
5. Call `npm run start` to start the documentation server locally.
6. When the start is complete, open http://127.0.0.1:9778/ in your browser.

## Publish to GitHub Pages

The easiest solution is to publish the API Doc portal on GitHub pages, which is free. Of course, you can host the generated API Doc portal files on any server, as it is purely static content.

1. Create a new repository with the name <b>your_github_username.github.io</b>. Make the repository public and initialize it with a readme file.

2. Modify the <b>chewieConfig.js/b> file in the forked <b>docpad-skeleton-apidocs</b> repository as follows:

 - Change the <b>srcLocation</b> attribute:
 ```
 srcLocation: 'https://github.com/your_github_username/your_github_username.github.io.git',
 ```
 - Change the <b>docuUrl</b> attribute:
 ```
 docuUrl: process.env.docuURL || 'https://your_github_username.github.io',
 ```

3. Modify the <b>docpad.coffee</b> file in the forked <b>docpad-skeleton-apidocs</b> repository. Change the <b>url</b> attribute as follows:

 ```
 environments:
   prod:
     templateData:
       site:
         url: "https://your_github_username.github.io"
 ```

4. Navigate to the local clone of the <b>docpad-skeleton-apidocs</b> repository in the terminal and run:
 ```
 git pull
 npm run init
 ```

5. Call the following command(s):
 - On Linux/Mac OS: `NODE_ENV=prod npm run compile`
 - On Windows OS:
    - `set NODE_ENV=prod`
    - `npm run compile`

6. Call the following command(s):
 - On Linux/Mac OS: `npm run preparePushResult && npm run pushResult`
 - On Windows OS:
    - `npm run preparePushResult`
    - `npm run pushResult`

7. When the push is complete, open http://your_github_username.github.io in your browser.
