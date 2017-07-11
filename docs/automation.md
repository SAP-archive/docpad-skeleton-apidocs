## Continuous integration in theory

Continuous integration practice comes from the software engineering world. When a team of developers creates an application, they want to ensure it is properly tested, follows coding best practices, and that it is production-ready. Therefore, on the server side, developers use special tools that allow them to perform continuous integration. The most popular tools are Jenkins, TeamCity, Travis CI, and Bamboo.

This practice also applies to documentation generation and publishing with the following benefits:
* Thanks to static site generators and their command line interfaces (CLI), you can easily automate documentation generation.
* Thanks to free solutions like GitHub Pages, you can also easily automate documentation publishing.

The <b>docpad-skeleton-apidocs</b> repository is a documentation portal template based on a static site generator called DocPad, and you can fully automate its usage through continuous integration.

## Why automate

All dev team members should contribute to the content to get good technical documentation. This means that when you scale up your organization and consequently have many different authors, you need an automated generation and publishing process in place.

You do not want everybody to install the <b>docpad-skeleton-apidocs</b> repository on their machines. For small updates, you want to go directly to your repository, make a change, and push it to the server immediately.

Thanks to automation, you do not need to call manually, from your local machine, commands like `npm run compile`, `npm run preparePushResult`, or `npm run pushResult`. You can configure these calls once in a CI tool and then push the red button for subsequent document generation and publishing tasks.

## [Travis CI](https://travis-ci.org)

Travis CI is a continuous integration tool integrated with GitHub. You can automate any operation on your projects that you trigger manually on your local machine.

What differs in Travis CI from other CIs is the configuration approach. You configure your jobs on a project level, by adding a proper configuration file in the Travis CI user interface, instead of configuring projects twice.

## [GitHub Pages](https://pages.github.com/)

GitHub Pages is a free hosting service for static sites. It is part of, and closely integrated with, GitHub. You can enable your project for hosting on GitHub Pages, and, as long as your project is a static site, automatically publish it.

## Start using Travis CI

The following instructions describe how to start using Travis CI with <b>docpad-skeleton-apidocs</b> to publish your documentation to GitHub Pages automatically.

### Upgrade your fork

For older versions of the <b>docpad-skeleton-apidocs</b> repository, change the following values:

1. Modify the <b>gulpFunctions.js</b> file by:
* Changing line 25 to `INTERACTIVE_DOCU_SRC_LOC = 'https://api.us.yaas.io/hybris/media/v2/public/files/58c27eb6ec8589001d059398';`
* Replacing the line `chewie.preparePushResult(opt, (err) => {` with `chewie.preparePushResult(config, opt, (err) => {`

2. Modify the <b>chewieConfig.js</b> file by changing `srcLocation` accordingly:
`process.env.RESULT_LOC || 'https://github.com/{{your_github_user}}/{{your_github_user}}.github.io.git'`

3. Modify the <b>package.json</b> file by changing the `chewie` attribute accordingly: 
`"chewie": "^0.1.3",`

### Install the Travis CLI tool for key generation

Travis CI needs access rights to commit to another repository. You can use the Travis CLI client locally to generate a proper access key to enable push capabilities to a GitHub repo. 

1. Install Ruby: For MacOS or Linux, https://www.ruby-lang.org/en/documentation/installation/ or on Windows, https://rubyinstaller.org/downloads/). 
 * Select the option to install the proper scripts in the environment variables (PATH).
 * To check whether you already have Ruby, call `ruby -v` in the terminal. If information about a Ruby version appears, you have a Ruby distribution and can skip this step.
2. Install Travis CLI by calling `gem install travis` in the terminal. 
 * You must have admin rights to your machine. Windows users might experience certificate issues. Follow these [instructions](http://guides.rubygems.org/ssl-certificate-update/) to update certificates if necessary.

### Sign in

Because the Travis CI login is integrated with GitHub, sign in using the following instructions.

1. Go to https://travis-ci.org/.
2. Sign in with your GitHub account.

### Enable Travis CI for your project

1. Go to https://travis-ci.org/profile/{{you_github_login}}.
2. Enable Travis CI on the <b>docpad-skeleton-apidocs</b> repository.

### Set up SSH for your repository

1. Clone your <b>docpad-skeleton-apidocs</b> fork using a terminal. To access the clone:
```
git clone docpad-skeleton-apidocs
cd docpad-skeleton-apidocs
```
2. Generate the SSH keys:
 * For MacOS or Linux, run the following command in the terminal:
```
ssh-keygen -t rsa -b 4096 -C "{{you_github_email}}" -f deploy-key
```
 * For Windows, open `Git Bash` that supports `ssh-keygen` and run:
```
ssh-keygen -t rsa -b 4096 -C "{{you_github_email}}" -f deploy-key
```
3. In the terminal, in the context of the <b>docpad-skeleton-apidocs<b> folder, encrypt the ssh key for Travis CI:

```
travis encrypt-file deploy-key
```
Take note of the result of the terminal call for the following steps.

4. Create a configuration file in the <b>docpad-skeleton-apidocs</b> repository with the name <b>.travis.yml<b>, including the dot at the beginning of the file name.

5. Replace the `openssl_info` entry with the terminal results you received in step 3.
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

### Add a deploy key in GitHub

Add the deployment key to the repository you use for GitHub Pages hosting.

1. Open the file <b>deploy-key.pub</b>, located in the <b>docpad-skeleton-apidocs</b> folder and copy its contents.
2. Open the page https://github.com/{{you_github_login}}/{{you_github_login}}.github.io/settings/keys.
3. Click <b>Add deploy key</b> and apply these values:
 * **Title**: `deploy-key`
 * **Key**: Paste the key you copied in step 1.
4. Select <b>Allow write access</b> and click <b>Add key</b>.

 ### Push all changes to the server

 Now you must push these files that you created to your repository:
 * <b>.travis.yml</b>
 * <b>deploy-key.enc</b>
 
<b>Note:</b>Do not push the other files you created, such as <b>deploy-key</b> with the private key. Instead, add these files to the <b>.gitignore</b> file so you do not mistakenly push them.

 Push <b>.travis.yml</b> and <b>deploy-key.enc</b> using the terminal commands:
 ```
 git add .travis.yml deploy-key.enc
 git commit -m "travis config and ssh key"
 git push origin master
 ```

## Check the pipeline

Congratulations! You have your first documentation continuous delivery pipeline. Now you can make a change to your documentation and then trigger the Travis CI job to rebuild your documentation portal on production.

1. Make a change to the documentation in your fork of the `minerva` service.
2. Go to https://travis-ci.org/ and rerun the most recent build.
3. Within a few minutes, you can verify that the changes are visible in your portal, https://{{your_github_user}}.github.io/.
