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

Modify `package.json` file by changing `chewie` attribute accordingly: "chewie": "^0.1.3",

### Install Travis CLI tool for key generation

Travis needs access rights to commit to another repository. There is a Travis CLI that you can use locally to generate a proper access key to enable push to GitHub repo.

1. Install Ruby: https://www.ruby-lang.org/en/documentation/installation/ (Windows: https://rubyinstaller.org/downloads/). Make sure to select option to install proper scripts in the environment variables (PATH).
You might have it already, check by calling `ruby -v` in the terminal. If there is an information about ruby version, it means you have it.
2. Install Travis CLI by calling `gem install travis` in the terminal (you need to have admin rights you your machine). Windows may have some certificate issues (http://guides.rubygems.org/ssl-certificate-update/)

### Sign in

TravisCI log in is integrated with GitHub login. Therefore make sure you are logged in to GitHub first.

1. Go to https://travis-ci.org/
2. Sign in with GitHub account

### Enable TravisCI for your project

1. Go to https://travis-ci.org/profile/{{you_github_login}}
2. Enable TravisCI on the `docpad-skeleton-apidocs`

### Setup SSH for your repository

1. Clone your `docpad-skeleton-apidocs` fork using terminal and access the clone:
```
git clone docpad-skeleton-apidocs
cd docpad-skeleton-apidocs
```
2. Generate SSH keys:
 * For MacOS or Linux do the following in the terminal:
```
ssh-keygen -t rsa -b 4096 -C "{{you_github_email}}" -f deploy-key
```
 * For Windows you need to open `Git Bash` that supports `ssh-keygen`
```
ssh-keygen -t rsa -b 4096 -C "{{you_github_email}}" -f deploy-key
```
3. In the terminal, in the context of the `docpad-skeleton-apidocs` folder encrypt the ssh key for travis:
```
travis encrypt-file deploy-key
```
The result of the terminal call is important for next steps.
4. Add configuration file. Create in `docpad-skeleton-apidocs` repository file with name `.travis.yml` (yes, there is a dot at the beginning of the file name).
Replace `openssl_info` entry with what you see in the terminal after previous step.
```
language: node_js
node_js: 6.9.2
before_install:
- git config --global user.name "Travis CI"
- git config --global user.email "travis@travis-ci.org"
- export RESULT_LOC='git@github.com:{{you_github_login}}/{{you_github_login}}.github.io.git'
- export NODE_ENV=prod
install:
- npm run prepare
script:
- {{openssl_info}}
- chmod 600 deploy-key
- eval `ssh-agent -s`
- ssh-add deploy-key
- npm run init
- npm run compile
- npm run preparePushResult
- npm run pushResult
```

### Add Deploy Key in GitHub

You need to add the deployment key to the repository you use for GitHub Pages hosting.

1. Open file `deploy-key.pub` located in `docpad-skeleton-apidocs` folder and copy its content.
2. Open this page https://github.com/{{you_github_login}}/{{you_github_login}}.github.io/settings/keys
3. Click `Add deploy key`:
 * **Title**: It should be `deploy-key`
 * **Key**: Paste here the key you copied in previous step
 4. Select `Allow write access` and click the `Add key` button

 ### Push all changes to the server

 You created 2 new files that you need to push to your repository:
 * `.travis.yml`
 * `deploy-key.enc`
 There are also other files but you do not want to push them, `deploy-key` with private key for example. You should add them to `.gitignore` file to not push them by mistake.

 Push this 2 files using terminal:
 ```
 git add .travis.yml deploy-key.enc
 git commit -m "travis config and ssh key"
 git push origin master
 ```

## Check the Pipeline

Congratulations! You have your first documentation continuous delivery pipeline. Now you can make a change to your documentation and then go and trigger the Travis job to rebuild your documentation portal on production.

1. Make a change in documentation in your fork of `minerva` service
2. Go to https://travis-ci.org/ and rerun last build
3. In 3min you can see a change in your portal https://{{your_github_user}}.github.io/
