## Continuous Integration in Theory

Continuous integration practice comes from software engineering world. When a team of developers creates an application, they want to assure it is properly tested, follows coding best practices and that it is production ready. Therefore on a server side they use special tools that enable them to do continuous integration. The most popular tools are Jenkins, Team City, TravisCI or Bamboo.

This pattern also applies to documentation generation and publishing:
* Thanks to static site generators and their command line interfaces you can also easily automate documentation generation
* Thanks to free solutions like GitHub Pages you can also easily automate documentation publishing

The docpad-skeleton-apidocs is a documentation portal template based on static site generator called DocPad and you can fully automate its usage through continuous integration.

## Why Automate

We believe that all dev team members should contribute to the content to get a good technical documentation. This means that once you scale up your organization and get many different authors, you need an automated generation and publishing process in place.

You do not want everybody to install docpad-skeleton-apidocs on their machines. For small updates, you want to go directly to your repository, make a change and push immediately to the server.

Thanks to the automation, you do not need to call manually, from your local machine all those commands like `npm run compile` or `npm run preparePushResult` or `npm run pushResult`. You can configure them once in the CI tool and then push the red button.

## [TravisCI](https://travis-ci.org)

A continuous integration tool integrated with GitHub. You can automate any operation on your projects that you trigger manually on your local machine.

What differs the tool from other CIs is the configuration approach. You configure your jobs on a project level by adding a proper configuration file, instead of doing it in the TravisCI user interface.

## [GitHub Pages](https://pages.github.com/)

Free hosting service for static sites. Part of GitHub and obviously closely integrated with GitHub. You just enable your project to be hosted on GitHub pages, and as long as your project is a static site, it is automatically published.

## Start Using TravisCI

Below you have instruction on how to start using TravisCI with docpad-skeleton-apidocs to have your documentation published to GitHub pages automatically.

### Upgrade your fork

For older versions of the `docpad-skeleton-apidocs` you need to change the following values:

Modify `gulpFunctions.js` file by:
* Changing line 25 to: `INTERACTIVE_DOCU_SRC_LOC = 'https://api.us.yaas.io/hybris/media/v2/public/files/58c27eb6ec8589001d059398';`
* Replacing line `chewie.preparePushResult(opt, (err) => {` with `chewie.preparePushResult(config, opt, (err) => {`

Modify `chewieConfig.js` file by changing `srcLocation` accordingly:
`process.env.RESULT_LOC || 'https://github.com/{{your_github_user}}/{{your_github_user}}.github.io.git'`

### Add configuration file

1. Create in `docpad-skeleton-apidocs` repository file with name `.travis.yml` (yes, there is a dot at the beginning of the file name)
```
language: node_js
node_js: 6.9.2
before_install:
- git config --global user.name "Travis CI"
- git config --global user.email "travis@travis-ci.org"
- export RESULT_LOC='https://'$DEPLOY_TOKEN'@github.com/{{your_github_user}}/{{your_github_user}}.github.io.git'
- export NODE_ENV=prod
install:
- npm run prepare
script:
- npm run init
- npm run compile
- npm run preparePushResult
- npm run pushResult
env:
  global:
    secure: empty
```

### Install Travis CLI tool for key generation

Travis needs access rights to commit to another repository. There is a Travis CLI that you can use locally to generate a proper access key to enable push to GitHub repo.

1. Install Ruby: https://www.ruby-lang.org/en/documentation/installation/ (Windows: https://rubyinstaller.org/downloads/). Make sure to select option to install proper scripts in the environment variables (PATH).
You might have it already, check by calling `ruby -v` in the terminal. If there is an information about ruby version, it means you have it.
2. Install Travis CLI by calling `gem install travis -v 1.8.8 --no-rdoc --no-ri` in the terminal (you need to have admin rights you your machine). Windows may have some certificate issues (http://guides.rubygems.org/ssl-certificate-update/)

### Get the private key

1. Go to `https://github.com/settings/tokens`
2. Click the `Generate new token` button
3. Select first `repo` option and click the `Generate token` button
4. You see the key, save it as you need it for travis encryption, for next steps

### Generate key

1. Call `travis encrypt -r {{your_github_user}}/docpad-skeleton-apidocs DEPLOY_TOKEN=my_token` in the terminal. For example `travis encrypt -r lukasz-lab/docpad-skeleton-apidocs DEPLOY_TOKEN=my_token`. This is what you should see in the terminal after few seconds:

```
secure: "Dwv24THGFtqBEYAvSAyTqsSxEzKG2hofb1jHsPhjCW7KyOC6mb6cdBaOk06ILIaqR2sRzkW8HZYgXNx2f8b9fnpwPZ/diheDMZ39V0eypr+JnaRJmYEQ43lRqPkELQAoas+zWHM6Rmfbg4X65nJvHXjVCy7p0ZXqOCAp4P9LM1XV520ltnr9eS+53vQzr7ZhT8vuYenovIiZ2zY6saDPC6HgO84eOgwtEKRBsQ2tTBbb/e9bI8cMUcUQZ+E3n+166+XU+qk7VvjLIKfzo1VRj9AISOS7gFu0X9fb+ao2w+gje6ArTneBMvBO63NNNWeN4yJVdU8kfRJ0ViYN/DHKlaO3ulYTY+YVcer1vZJhKfLjL8/ucXRcOdNhKWjpdKsWs2OaGTt8Wp7z8nGUUY0zt7S54oDHpYaRwyTdH7kLNNcoyH0cCHqOnWUZ4sRoEhzhjHVE9HPKil19rD3KFgRBP6YVAbYo1GlzYgYu4Tc9YrfCifayyCOw45jd+58557M0hzgUUtD5KX49rPZoJiXJ0mCvDCaBvhGjzqqZnrHmyodZ1t7JBXNdBZOgTFsEb80OY3md04xL3AyEhYDeljwMNYWbIGMj7YspoYtkk/OpagVHnelO03rag9MboWcF3v7IvMTV/A+aiIaJYDVtSrvIsChwn1eNr4Yvbqg5tV9bULI="
```
2. Copy the value and save as new `secure` value in the `.travis.yml` file in `docpad-skeleton-apidocs` in GitHub

### Sign in

TravisCI log in is integrated with GitHub login. Therefore make sure you are logged in to GitHub first.

1. Go to https://travis-ci.org/
2. Sign in with GitHub account

### Enable TravisCI for your project

1. Go to https://travis-ci.org/profile/{{you_github_login}}
2. Enable TravisCI on the `docpad-skeleton-apidocs`

## Check the Pipeline

Congratulations! You have your first documentation continuous delivery pipeline. Now you can make a change to your documentation and then go and trigger the Travis job to rebuild your documentation portal on production.

1. Make a change in documentation in your fork of `minerva` service
2. Go to https://travis-ci.org/ and rerun last build
3. In 3min you can see a change in your portal https://{{your_github_user}}.github.io/
