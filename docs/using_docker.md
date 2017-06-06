The best way to quickly start using the skeleton is to set up your work with Docker. This way you don't need to perform any complex installations with cross platform issues and dependencies.

Docker makes is easy to simulate locally the same behavior you expect on the server. Whatever you set up on your local system within Docker will work the same on any other operating system, your colleague's Windows machine or some Unix server.

## Basic start

Open the terminal and start documentation portal container with the following:
```
docker run -it --name api-doc-sample ~/mylocal:/mylocal -p 9778:9778 derberg/dsa-quickstart /bin/bash
# On Windows, you need to replace ~/mylocal with //C/Users/{your user name}
npm run start
```

Now in your browser you can access documentation portal through this link: http://localhost:9778/

You can exit the container by stopping the server with ctrl+c keyboard shot, and then by typing `exit` and hitting ENTER.

This is how you reuse the same container later:
```
docker start api-doc-sample
docker exec -it api-doc-sample /bin/bash
```

## Copy samples

Now copy our samples and modify them and make the template work with your content.


1. Fork the following repo (it means open the links and click on [Fork](https://help.github.com/articles/fork-a-repo/) button in the top right corner of the page): https://github.com/YaaS/chewie-sample-data
2. Make some content changes in forked repo in `/content/services/hodoripsum/docu/files/overview.html.md.eco`
3. Modify the registry to get your new content, edit `/registry/hodoripsum.json` file and change location url to the new one, your fork url: `https://github.com/{your_github_username}/chewie-sample-data`

## Configure the template

Now run the template again but with different registry path and separate initialization.

```
export REGISTRY_PATH=https://github.com/{your_github_username}/chewie-sample-data
npm run init
npm run start
```

Now you know how to fill the template with your own content. Examine the forked sample repo, how the content is structured and how registry works.

## Modify front page

Modifications in files inside images require you to use a terminal based editor.

1. Install **nano** inside container: `apk update && apk add nano`
2. Navigate to `/src/documents/index.html.eco`
3. Edit file by calling `nano index.html.eco`
4. Modify descriptions without touching HTML elements
5. Save with ctrl+o and exit with ctrl+x

## Publish generated content

Now you want to show to the entire community your brand new documentation portal. Best, free and easiest solution, is Github Pages feature.

1. Configure git inside the container:
```
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
```
2. Create new repository with the following name: `your_github_username.github.io`. It must be public and initialized (You do it in UI during creation, just initialize with a readme file).
3. Now add 2 more configurations before you build docu again:
```
export docuURL=https://{your_github_username}.github.io
export RESULT_LOC=https://github.com/{your_github_username}/{your_github_username}.github.io
npm run init
NODE_ENV=prod npm run compile
npm run preparePushResult
npm run pushResult
```
Provide github username and password when needed.

## Modify the template

To modify some specific HTML files it is better to fork/copy the template and do modifications over there.

### Navigate to proper location

1. In the container, access the `mylocal` folder:
```
cd ..
cd mylocal
```
2. Now create some folder and make sure you can also see it in your local system, in some explorer:
```
mkdir test
```

### Get things running

1. Get a [GitHub](https://github.com/) account and fork the following repo (it means open the links and click on [Fork](https://help.github.com/articles/fork-a-repo/) button in the top right corner of the page): https://github.com/YaaS/docpad-skeleton-apidocs
2. Clone the skeleton: `git clone https://github.com/{your_github_username}/docpad-skeleton-apidocs.git`
3. Access the skeleton and install:
```
cd docpad-skeleton-apidocs
npm run prepare
```
4. Modify descriptions in `/src/documents/index.html.eco`
5. Start portal locally again
```
export REGISTRY_PATH=https://github.com/{your_github_username}/chewie-sample-data
npm run init
npm run start
```

## Custom Docker image

Once you are happy with your changes to the template, and you have the whole setup ready, create your own Docker image so other people in your organization can work with it easily:

1. Modify [Docker](../Dockerfile) file used to create **derberg/dsa-quickstart** image. Just make sure link to the skeleton points to your fork/copy
2. Get a Docker account: https://hub.docker.com/
3. Call `docker login` to authorize
4. Build the image from directory where **Dockerfile** is located: `docker build -t my-dsa-quickstart .`
5. Tag the image: `docker tag my-dsa-quickstart {DOCKER_ID_USER}/my-dsa-quickstart`
6. Push the image to the hub: `docker push {DOCKER_ID_USER}/my-dsa-quickstart`
