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
  async = require('async'),
  path = require('path'),
  INTERACTIVE_DOCU_SRC_LOC = 'https://devportal.yaas.io/build.zip';


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
  async.series({
      hrefSingleQuotes: _asyncCb(chewie.replacer.replaceInFile, './out/**/*.html', `href='/`, `href='${config.docuUrl}/`, './out'),
      hrefDoubleQuotes: _asyncCb(chewie.replacer.replaceInFile, './out/**/*.html', `href="/`, `href="${config.docuUrl}/`, './out'),
      srcSingleQuotes: _asyncCb(chewie.replacer.replaceInFile, './out/**/*.html', `src='/`, `src='${config.docuUrl}/`, './out'),
      srcDoubleQuotes: _asyncCb(chewie.replacer.replaceInFile, './out/**/*.html', `src="/`, `src="${config.docuUrl}/`, './out'),
      urlSingleQuotes: _asyncCb(chewie.replacer.replaceInFile, './out/**/*.css', `url('/`, `url('${config.docuUrl}/`, './out'),
      urlDoubleQuotes: _asyncCb(chewie.replacer.replaceInFile, './out/**/*.css', `url("/`, `url("${config.docuUrl}/`, './out')
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
      return cb();
    }
    log.info('Push operation completed');
    cb();
  });
}

function getDependencyInteractiveDocu(cb) {

  download(INTERACTIVE_DOCU_SRC_LOC)
    .pipe(unzip())
    .pipe(gulp.dest('./src/raw'))
    .on('end', cb);
}

function preparePushResult(cb) {

  const topics = _getTopics(argv.topics);
  const opt = {
    'src': `${config.skeletonOutDestination}/**`,
    'dest': config.generationResult.clonedResultFolderPath,
    'branch': config.generationResult.branch,
    'message': Boolean(!argv.topics) ? 'Push operation for the whole Dev Portal' : `Push operation for ${argv.topics}`,
    'independent': Boolean(argv.topics),
    'tempLocation': config.tempLocation,
    'notClonedRepositoriesFile': config.notClonedRepositoriesFile,
    'indepenedentDocuRepositoriesFile': config.indepenedentDocuRepositoriesFile
  };

  chewie.preparePushResult(opt, (err) => {
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
  getDependencyInteractiveDocu
};
