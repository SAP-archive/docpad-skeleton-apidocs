The best way to quickly start using the skeleton is to set up your work with Docker. This way, you don't need to perform any complex installations with cross-platform issues and dependencies.

Docker makes it easy to simulate locally the same behavior you expect on the server. Whatever you set up on your local system within Docker works the same on any other operating system, whether it's your colleague's Windows machine or a Unix server.

Follow the instructions in this document to set up Docker to use the skeleton. 

## Basic start

1. Open a terminal window and start a documentation portal container with the following command:
```
docker run -it --name api-doc-sample -v ~/mylocal:/mylocal -p 9778:9778 derberg/dsa-quickstart /bin/bash
# On Windows, replace ~/mylocal with //C/Users/{your user name}
npm run start
```
2. In your browser, access the documentation portal at http://localhost:9778/.
3. To stop the server and exit the container, press CTRL+C on your keyboard, then type `exit` and press ENTER.

To reuse the same container later, run:
```
docker start api-doc-sample
docker exec -it api-doc-sample /bin/bash
```

## Copy samples

Copy the content samples and modify them to make the template work with your content.

1. Click https://github.com/YaaS/chewie-sample-data to open the repository.
2. Click <b>[Fork](https://help.github.com/articles/fork-a-repo/)</b> in the top-right corner of the page. 
3. In the newly-forked repository, make some content changes in the file <b>/content/services/hodoripsum/docu/files/overview.html.md.eco</b>.
3. To modify the registry to get your new content, in the <b>/registry/hodoripsum.json</b> file, change the location URL  `https://github.com/{your_github_username}/chewie-sample-data` to your fork URL.

## Configure the template

Run the template again with a different registry path and separate initialization:

```
export REGISTRY_PATH=https://github.com/{your_github_username}/chewie-sample-data
npm run init
npm run start
```

Now you can fill in the template with your own content. Examine the forked sample repository to see how the content is structured and how the registry works.

## Modify the front page

Use a terminal-based editor to modify files inside images. Use the following steps to modify the front page. 

1. Navigate to <b>/src/documents/index.html.eco</b>.
2. Edit the file by calling <b>nano index.html.eco</b>.
3. Modify the descriptions without changing the HTML elements.
4. To save, press CTRL+o on your keyboard. 
5. Press CTRL+x to exit.

## Publish the generated content

Use the following instructions to show off your brand-new documentation portal to the entire community. The best and easiest free solution to use for these steps is the Github Pages feature.

1. Configure git inside the container:
```
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
```
2. Create a new repository with the name <b>your_github_username.github.io</b>. 
3. Set the repository to `public` and initialize it with a readme file.
4. Add the following configurations before you build the documentation again:
```
export docuURL=https://{your_github_username}.github.io
export RESULT_LOC=https://github.com/{your_github_username}/{your_github_username}.github.io
npm run init
NODE_ENV=prod npm run compile
npm run preparePushResult
npm run pushResult
```
Provide your github username and password when requested.

## Modify the template

To modify specific HTML files, it is best to fork or copy the template and modify files within the forked repo or copied files.

### Navigate to the proper location

1. In the container, access the <b>mylocal</b> folder:
```
cd ..
cd mylocal
```
2. Create a folder and make sure you can see it in your local system, in any file explorer or browser:
```
mkdir test
```

### Get things running

1. Get a [GitHub](https://github.com/) account if you don't have one already.
2. Click https://github.com/YaaS/docpad-skeleton-apidocs to open the repository.
3. Click <b>[Fork](https://help.github.com/articles/fork-a-repo/)</b> in the top-right corner of the page. 
4. Clone the skeleton using the command `git clone https://github.com/{your_github_username}/docpad-skeleton-apidocs.git`.
3. Access and install the skeleton:
```
cd docpad-skeleton-apidocs
npm run prepare
```
4. Modify the descriptions in <b>/src/documents/index.html.eco</b>.
5. Restart the portal locally:
```
export REGISTRY_PATH=https://github.com/{your_github_username}/chewie-sample-data
npm run init
npm run start
```

## Custom Docker image

When you are happy with your changes to the template and the setup is complete, use the following steps to create your own Docker image so other people in your organization can work with it easily.

1. Get a [Docker](https://hub.docker.com/) account.
2. Call `docker login` to authorize.
3. Build the image from the directory containing **Dockerfile**:
`docker build -t my-dsa-quickstart .`
4. Tag the image: 
`docker tag my-dsa-quickstart {DOCKER_ID_USER}/my-dsa-quickstart`
5. Push the image to the hub: 
`docker push {DOCKER_ID_USER}/my-dsa-quickstart`