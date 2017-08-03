/* eslint camelcase: 0 */
'use strict';

const gulp = require('gulp'),

  //below is not explicitly used in the gulpfile but is triggered by the docpad.coffee
  chewie = require('chewie'),
  argv = require('yargs')
  .alias('s', 'section')
  .alias('t', 'topics')
  .alias('l', 'local')
  .alias('r', 'rewriter')
  .alias('b', 'browser')
  .alias('p', 'platform')
  .alias('a', 'sauce')
  .alias('y', 'type')
  .alias('f', 'force')
  .argv,
  log = require('./node_modules/chewie/src/helpers/logger'),
  unzip = require('gulp-unzip'),
  download = require('gulp-download'),
  replace = require('gulp-replace'),
  async = require('async'),
  path = require('path'),
  appConfig = require('./config/default');

const LOCAL_REGISTRY_PATH = '../sample_data';

const localValue = argv.local;

if (localValue) {
  const isEmpty = localValue && localValue === true; //true means that flag is available but no content was provided - use default

  const pathToRegistry = isEmpty ? LOCAL_REGISTRY_PATH : localValue;

  process.env.REGISTRY_PATH = path.resolve(__dirname, pathToRegistry);

  process.env.REGISTRY_LOCATION = 'local';
}

const config = require('./chewieConfig');
const topics = _getTopics(argv.topics);



function serviceLatest(cb) {

  const registry = require(config.registry.registryPath);
  chewie.serviceLatestCreate(registry, config, cb);
}

function replaceApiReferences(cb) {

  chewie.prepareRegistry(topics, config, () => {

    const registry = require(config.registry.registryPath);
    chewie.replaceApiReferences(registry, config, cb);
  });
}

function start(cb) {

  chewie.removeClonedRepositories(argv.force, config, () => {

    let registry;

    //If you use remote registry, you want to pass the name of the branch in the remote repo, for example you can run task with: '-b dev'
    chewie.prepareRegistry(topics, config, () => {

      const fullRegistry = require(config.registry.registryPath);

      topics ? registry = require(`${config.tempLocation}/${config.registry.shortVersionFileName}`) : registry = fullRegistry;

      //stop processing if there is no registry
      if (!registry) {
        throw new Error('Registry is not provided');
      }

      async.series({
        cloneDocuSources: _asyncCb(chewie.cloneDocuSources, registry, config, topics),
        rewriteRAML: _asyncCb(chewie.rewriteRAML, registry, config, argv.r),
        copyTutorials: _asyncCb(chewie.copyTutorials, registry, config),
        preparePlaceholders: _asyncCb(chewie.preparePlaceholders, registry, config),
        createMetaInfo: _asyncCb(chewie.createMetaInfo, fullRegistry, topics, config),
        prepareApiReferences: _asyncCb(chewie.prepareApiReferences, registry, config),
        createUrlPartials: _asyncCb(chewie.createUrlPartials, registry, config),
        createRAMLPartials: _asyncCb(chewie.createRAMLPartials, registry, config),
        copyContent: _asyncCb(chewie.copyContent, fullRegistry, config)
      }, cb);
    });
  });
}

function fixTables(cb) {

  chewie.replacer.replaceInFile('./out/**/*.html', '<table>', '<table class="table table-striped techne-table">', './out', cb);
}

function fixLinks(cb) {
  const docuUrl = config.docuUrl;
  async.series({
    hrefSingleQuotes: _asyncCb(chewie.replacer.replaceInFile, './out/**/*.html', `href='/`, `href='${docuUrl}/`, './out'),
    hrefDoubleQuotes: _asyncCb(chewie.replacer.replaceInFile, './out/**/*.html', `href="/`, `href="${docuUrl}/`, './out'),
    srcSingleQuotes: _asyncCb(chewie.replacer.replaceInFile, './out/**/*.html', `src='/`, `src='${docuUrl}/`, './out'),
    srcDoubleQuotes: _asyncCb(chewie.replacer.replaceInFile, './out/**/*.html', `src="/`, `src="${docuUrl}/`, './out'),
    urlSingleQuotes: _asyncCb(chewie.replacer.replaceInFile, './out/**/*.css', `url('/`, `url('${docuUrl}/`, './out'),
    urlDoubleQuotes: _asyncCb(chewie.replacer.replaceInFile, './out/**/*.css', `url("/`, `url("${docuUrl}/`, './out')
  }, cb);
}

function minify(cb) {

  chewie.minify(config, cb);
}

function clean(cb) {

  chewie.prepareRegistry(topics, config, () => {

    const registry = require(config.registry.registryPath);
    chewie.cleanSkeleton.clean(registry, config, argv.s && argv.s.toLowerCase(), cb);
  });
}

function pushResult(cb) {
  switch(config.docuProvider) {
  case 'S3':
    pushResultToS3(cb);
    break;
  case 'GIT':
    pushResultToStash(cb);
    break;
  default:
    log.error('docuProvider is not correct!');
    throw new Error(`${config.docuProvider} is not a valid content provider.`);
  }
}

// Push generated data to S3
function pushResultToS3(cb) {

  if(!config.generationResult.s3.credentials.accessKeyId || !config.generationResult.s3.credentials.secretAccessKey || !config.registry.branch){ 
    log.warning('AWS credentials were not exported.');
    return cb(new Error('Missing AWS credentials'));
  }

  chewie.s3.upload(config.registry.branch, config.generationResult.s3.credentials, config.generationResult.s3.bucket, config.generationResult.clonedResultFolderPath, (client) => log.info(config.registry.branch))
  .then( () => {
    log.info('Push operation completed');
    return cb();
  })
  .catch((err) => {
    log.error(err);
    return cb(err);
  });
}

// Push generated data to S3
function backupResultInS3(cb) {
  const versionId = process.env.versionId || process.env.bamboo_buildResultKey;

  if(!config.docuProvider === 'S3' || !versionId) return cb();

  const backupPath = `backup/${config.registry.branch}/${process.env.bamboo_buildResultKey}`;

  chewie.s3.upload(backupPath, config.generationResult.s3.credentials, config.generationResult.s3.bucket, config.generationResult.clonedResultFolderPath, (client) => log.info(backupPath))
  .then( () => {
    log.info('Backup operation completed');
    return cb();
  })
  .catch((err) => {
    log.error(err);
    return cb(err);
  });
}


// Push generated data to STASH repository
function pushResultToStash(cb) {
  const topics = _getTopics(argv.topics);
  const opt = {
    'src': `${config.skeletonOutDestination}/**`,
    'dest': config.generationResult.clonedResultFolderPath,
    'branch': config.generationResult.branch,
    'message': Boolean(!argv.topics) ? 'Push operation for the whole Dev Portal' : `Push operation for ${argv.topics}`,
    'independent': Boolean(argv.topics)
  };

  chewie.pushResult(opt, (err) => {
    if (err) {
      log.error(err);
      return cb(err);
    }
    log.info('Push operation completed');
    cb();
  });
}

function getDependencyInteractiveDocu(cb) {
  download(appConfig.interactiveDocuSrcUrl)
    .pipe(unzip())
    .pipe(gulp.dest('./src/raw'))
    .on('end', cb);
}

function prepareInteractiveDocuToDeploy(cb) {

  const BUILD_PATH = 'out/build';
  const docuUrl = config.docuUrl;

  chewie.replacer.replaceInFile(
    `${BUILD_PATH}/plugins/custom-location-persistence.js`,
    /TO_REPLACE_URL=[^,]*/,
    `TO_REPLACE_URL="${docuUrl}/build"`,
    `${BUILD_PATH}/plugins`,
    () => {
      chewie.replacer.replaceInFile(
        `${BUILD_PATH}/plugins/custom-location-persistence.js`,
        /TO_REPLACE_ORIGIN=[^;]*/,
        `TO_REPLACE_ORIGIN="${docuUrl}"`,
        `${BUILD_PATH}/plugins`
      );
    }
  );

  chewie.replacer.replaceInFile(
    `${BUILD_PATH}/plugins/embed-hash-persistence.js`,
    /TO_REPLACE_URL=[^,]*/,
    `TO_REPLACE_URL="${docuUrl}/build"`,
    `${BUILD_PATH}/plugins`
  );

  chewie.replacer.replaceInFile(
    `${BUILD_PATH}/scripts/embed.js`,
    /TO_REPLACE_URL=[^,]*/,
    `TO_REPLACE_URL="${docuUrl}/build"`,
    `${BUILD_PATH}/scripts`
  );

  chewie.replacer.replaceInFile(
    `${BUILD_PATH}/scripts/vendor/loadStyles.js`,
    /TO_REPLACE_URL=[^,]*/,
    `TO_REPLACE_URL="${docuUrl}"`,
    `${BUILD_PATH}/scripts/vendor`
  );

  chewie.replacer.replaceInFile(
    `${BUILD_PATH}/plugins/tokenValidator.js`,
    /TO_REPLACE_REDIR_URL=[^,]*/,
    `TO_REPLACE_REDIR_URL="${docuUrl}/auth.html"`,
    `${BUILD_PATH}/plugins`
  );

  chewie.replacer.replaceInFile(
    `${BUILD_PATH}/plugins/chooseApp.js`,
    /TO_REPLACE_REDIR_URL=[^,]*/,
    `TO_REPLACE_REDIR_URL="${docuUrl}/auth.html"`,
    `${BUILD_PATH}/plugins`
  );

  chewie.replacer.replaceInFile(
    `${BUILD_PATH}/scripts/bundle.js`,
    '/images/icons/pencil.svg',
    `${docuUrl}/images/icons/pencil.svg`,
    `${BUILD_PATH}/scripts`
  );

  cb();
}

function preparePushResult(cb) {

  const topics = _getTopics(argv.topics);
  const opt = {
    'src': [`${config.skeletonOutDestination}/**`, `${config.skeletonOutDestination}/**/.nojekyll`],
    'dest': config.generationResult.clonedResultFolderPath,
    'branch': config.generationResult.branch,
    'message': Boolean(!argv.topics) ? 'Push operation for the whole Dev Portal' : `Push operation for ${argv.topics}`,
    'independent': Boolean(argv.topics),
    'tempLocation': config.tempLocation,
    'notClonedRepositoriesFile': config.notClonedRepositoriesFile,
    'indepenedentDocuRepositoriesFile': config.indepenedentDocuRepositoriesFile
  };

  chewie.preparePushResult(config, opt, (err) => {
    if (err) {
      log.error(err);
      return cb();
    }
    log.info('Prepare pushResult operation completed');
    cb();
  });
}


function _getTopics(topics) {

  if(topics === true){
    throw new Error(`You must provide list of topics split with comma while using --topics flags. For example "'services:Cart','tools':'Builder SDK','services':'Events'"`);
  }
  return topics && topics.split(',').map((topic) => {
    const values = topic.split(':');
    return {
      type: values[0],
      name: values[1]
    };
  });
}

function _asyncCb() {
  const args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments)); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
  const func = args[0];
  const params = args.slice(1);

  return (cb) => {
    log.info(`Started task: ${func.name}`);
    params.push(() => {
      log.info(`Finished task: ${func.name}`);
      cb();
    });
    func.apply(null, params);
  };
}

/////////////////////////////////////////
///            TESTS                  ///
/////////////////////////////////////////

function test(cb) {

  const nightwatch = require('gulp-nightwatch');
  const helper = require('./tests/helpers/helper');
  const innerConfig = require('./tests/helpers/variables');
  const jsonTransform = require('gulp-json-transform');
  const os = require('os');

  const enviroment = helper.determineEnviroment(argv.b, argv.p);

  log.info(`Running tests against nightwatch envroment(s): ${enviroment} `, argv.a ? 'Test will be run on Sauce Labs (parameter s is present)' : 'Test will be run on localhost');

  gulp.src('./nightwatch.json')
    .pipe(jsonTransform((data) => {
      data.test_settings.default.launch_url = innerConfig.launchUrl;

      data.src_folders = argv.y ? [`tests/test-cases/${argv.y}`] : ['tests/test-cases'];

      data.test_settings.default.selenium_port = argv.a ? 80 : 4450;
      data.test_settings.default.selenium_host = argv.a ? 'ondemand.saucelabs.com' : 'localhost';
      data.selenium.start_process = argv.a ? false : true;

      data.test_settings.default.username = innerConfig.username;
      data.test_settings.default.access_key = innerConfig.accessKey;

      return data;
    }), 4)
    .pipe(gulp.dest('./'))
    .pipe(nightwatch({
      configFile: 'nightwatch.json',
      cliArgs: {
        env: enviroment,
        retries: 3
      }
    }))
    .on('error', cb);
}

module.exports = {
  serviceLatest,
  replaceApiReferences,
  start,
  fixTables,
  fixLinks,
  minify,
  clean,
  pushResult,
  preparePushResult,
  backupResultInS3,
  getDependencyInteractiveDocu,
  prepareInteractiveDocuToDeploy,
  test
};
