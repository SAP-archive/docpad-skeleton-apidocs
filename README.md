# DevPortal [DocPad](https://github.com/bevry/docpad) skeleton and its Web application for CloudFoundry deployment

## Getting Started

Quickly install DocPad, clone DevPortal project and start it to see the DevPortal running locally

1. [Install DocPad](http://docpad.org/docs/install) and gulp (npm install --global gulp@3.8.8)

2. Clone the project and run the server

  ``` bash
  git clone ssh://git@stash.hybris.com:7999/paas/devportal.git
  cd devportal
  cd devportal
  gulp start
  docpad server
  ```

Flags:
- `--local` - you can provide local registry path or take the default one from `sample_data` directory
- `--topics` - you can provide list of topics split by comma, for example `"'services:Account','tools:Builder SDK','services:Feedback'"`

3. Open [http://localhost:9778/](http://localhost:9778/)

4. Once you are done, cleanup the skeleton with `gulp clean`

## Bower Components

The Dev Portal relies on the following Bower Components

1. jQuery
2. [Techne](http://techne.yaas.io/) Components and Patterns.  
3. Bootstrap

**Install Bower globally**	`npm install -g bower`


**To Install Techne**	`bower install hyTechne`

Bower components are installed in devportal/devportal/src/raw/bower_components/

**To Update Techne**	`bower update hyTechne`

## UI Testing

To trigger tests against our develop env

1. Navigate to `devportal/devportal/tests`
2. Install tools
  ```
  npm install -g mocha grunt grunt-init grunt-cli
  npm install
  export NODE_ENV=wookiee (or temp/stage/prod/dev)
  ```
3. Run tests: `grunt`

## Unit testing

If you want to run unit tests through development:

1. Navigate to `devportal/devportal/`
2. To run tests write on terminal: npm test

Make sure all dependencies are installed. If some of them are missing, write `npm install` on `/devportal/devportal` directory.

Any changes on source files will rerun tests. If you want to change it and disable autoWatch, edit karma.conf.js file with autoWatch section.

If you want to add new unit tests:

1. Create file with following name pattern: `*.spec.js` in the `/devportal/tests/unitTests/` directory. Its configurable through karma.conf.js file (files section) with proper file masks.<br/> Example filename: **CreateManageCtrl.spec.js** or **restTesting.spec.js**
2. Created tests will be automatically added.


## Performance testing

**Prerequisites**: SAP GitHub account

1. Navigate to: <a href="http://ip-155-56-37-63.dmzmo.sap.corp/job/wookiee_DevPortal/">Jenkins prepared for performance testing</a>,
2. Log in (login and password can be found in <a href="https://github.wdf.sap.corp/I303874/gatlingdefaultsimulation/tree/master/docs">the instruction</a>),
3. Run test.

If you want to change parameters of a test navigate to <a href="https://github.wdf.sap.corp/I308049/DevPortalGatlingTests">SAP GitHub</a>.

All instructions that are connected with performance testing can be found <a href="https://github.wdf.sap.corp/I303874/gatlingdefaultsimulation">here</a>.


## Project Structure

* **devportal**: DocPad skeleton for DevPortal
* **deployment**: All files used in the deployment process.
* **sample_data**: All sample data needed for local development.
* **libraries**: Additional libs we use in the process.

## Important Links

* Dev Portal Bamboo building plans:
  * Dev: https://bamboo.hybris.com/browse/PAAS-DEVPDEV
  * Stage: https://bamboo.hybris.com/browse/PAAS-DEVPORSTAGE
  * Prod: https://bamboo.hybris.com/browse/PAAS-DEVPP
  * DevPortal-development: https://bamboo.hybris.com/browse/PTW-DD [See: WOO-289]

* Dev Portal Bamboo deployment plans:
  * Dev: https://bamboo.hybris.com/browse/PTW-DDPL
  * Stage: https://bamboo.hybris.com/browse/PTW-DDPL1
  * Prod: https://bamboo.hybris.com/browse/PTW-DDPL2

* Dev Portal - web pages:
  * Dev: http://devportal-dev.stage.yaas.io
  * Stage: https://devportal.stage.yaas.io/
  * Prod: https://devportal.yaas.io/
  * DevPortal-development: https://devportal-wookiee.stage.yaas.io

* DevPortal guidelines: http://devportal.yaas.io/internal/docu_guide/

## Local registry

To use registry that you provided you will need to add `-l` or `--local` flag with registry path that is either:
- relative to `gulpfile.js` file (for example `../sample_data`)
- direct to file (for example `/Users/123456/projects/your_registry`).

And command would look like this: `gulp start --local '/Users/123456/projects/your_registry'`

You must provide proper `.json` files to this location, just like in `devportal_registry`

## Independent generation of topics

To generate only given topics instead of whole service you will need to use `--topics` or `-t` flag that takes list of topics as parameter that are separated by comma.
To generate two topics, for example `Account`, `Builder SDK` and `Feedback` your command will look like this: `gulp start -t "'services:Account','tools:Builder SDK','services:Feedback'"`

Mind that this works as independent generation and metadata is generated for every topic that might slow things down, to use it locally we recommend using local registry that is described above in this `README`.

## Testing

### Running application
Run following commands:

```
npm install
gulp test
```

As simple as that. These configuration will run tests against default node enviroment and for firefox browser. If you want to customize, see next chapter.

### Running tests on different browsers and operation systems

#### Browsers
If you want specify different browser than firefox you have to setup **b** parameter.
Consider following example:

```
npm install
gulp test -b chrome
```

For local developement (bamboo doesn't support that for now) there is also possibility to run tests against all browsers in parallel mode. To achieve that **b** parameter has to be set to **all**.
Example:

```
npm install
gulp test -b all
```

Available options for **b** parameter: firefox, chrome, all.

#### Operating system

We also automatically detect operation system, so you don't have to be aware of that, but if you would like to specify explicitly there's  **p** parameter for that.
Example:

```
npm install
gulp test -b firefox -p linux
```
Available options for **p** parameter: ios, linux


Linux option is used for bamboo plans!

### Integration with Bamboo

Example of working plan: https://bamboo.hybris.com/browse/PTW-SUT

There's two additional things you have to do at bamboo compare to local developement.
 - Before running **gulp** command you have to export DISPLAY variable:

```
export DISPLAY=localhost:99
```

- Run local gulp instead of global one (thanks to that we're not depend on agent configuration. Since we're using babel and ES6 syntax it does matter because older gulp version don't support that).

Example of working configuration of Script task:
```
export DISPLAY=localhost:99
./node_modules/gulp/bin/gulp.js test
```

The agent you choose for this plan have to browser you choose by settings, gulp, NodeJS.

Plan is setup for agent with **agent.category = ui**.

So the final working configuration would contain :
 - Checkout test repository
 - NPM task with install command
 - Script task (example above)

### Running tests on SauceLabs

If you want to run test at SauceLabs enviroment you have to specify **s** argument.

```
gulp test -s
```

You have to provide proper credentials at Nightwatch config (username and access_key).

### Node Config Variables

  * **url** - URL address for testing page
  * **apiDocsHeaders** - Example headers for apidocs left nav

  IMPORTANT! Each value have to be from different package! (E.g Media and Document can not be together cause its from this same package)

  * **apiPackages** - Example packages for apidocs left nav
  * **notConsistentPair** - Value pair which is not consistent across headers and packages (e.g Media is not part of Events package)
  * **consistentPair** - Value pair which is consistent across header and packages (e.g Document is part of Persistence package)

  **Important!** Values in **notConsistentPair** and **consistentPair** have to be different (we can not use for example Document in both).
 ```
 {
     "url": "https://generic-rd-team-sap-cec-yaas:YaaSRocks@devportal-wookiee.stage.yaas.io",
     "apiDocsHeaders": ["Document", "Media", "Email"],
     "apiPackages": ["Cart", "Events", "Persistence"],
     "notConsistentPair": ["Media", "Events"],
     "consistentPair": ["Document", "Persistence"]
 }
 ```
