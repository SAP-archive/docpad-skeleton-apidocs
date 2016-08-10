const config = {

  tempLocation: './tmp',
  skeletonDestination: './src',
  skeletonOutDestination: './out',
  placeholdersLocation: `./src/raw/placeholders`,
  docuUrl: process.env.docuURL || 'http://your.webpage.io',

  registry: {
    location: process.env.REGISTRY_LOCATION || 'remote',
    path: process.env.REGISTRY_PATH || 'https://github.com/hybris/docpad-skeleton-apidocs-sampledata.git',
    fileName: 'docu_registry.json',
    branch: process.env.docuBranch || 'master',
    shortVersionFileName: 'shrinkedRegistry.json',
    clonedRegistryFolder: 'registry'
  },

  docu: {
    clonedRepoFolder: 'docuSources',
    srcRepoDocuFolder: 'docu',
    metaFileName: 'meta-inf',
    folders: {
      mainDocu: 'files',
      getStart: 'gettingstarted',
      releaseNotes: 'release_notes',
      contentReuse: 'partials'
    }
  },

  generationResult: {
    srcLocation: 'https://github.com/hybris/chewie-sample-result.git',
    branch: process.env.docuBranch || 'master',
    cloneLocation: 'latestResultRepo'
  },
  constantLocations: {
    apinotebooksLocation: './src/documents/apinotebooks',
    apinotebooksTestMatrixFile: './src/raw/matrix/apinotebook.txt'
  },

  typesSrcLocNotMainDocu: [
    'gettingstarted',
    'overview',
    'solutions',
    'architecture',
    'docu_guide'
  ],

  typesWithReleaseNotes: [
    'tools',
    'services'
  ],

  defaultBaseUriDomain: 'localhost'
};

const out = config.skeletonOutDestination;

config.independentGeneration = {
  notUsedFiles: [`${out}/apiconsole`,
                `${out}/blog`,
                `${out}/bower_components`,
                `${out}/error`,
                `${out}/fonts`,
                `${out}/matrix`,
                `${out}/vendor`,
                `${out}/atom.xml`,
                `${out}/scripts`,
                `${out}/styles`,
                `${out}/fonts`,
                `${out}/rn/index.html`,
                `${out}/internal/rn/index.html`,
                `${out}/internal/temp`,
                `${out}/lunr`,
                `${out}/internal/rn/internal_atom.xml`,
                `!${out}/.git`]
};

config.minification = {
  js: [{
    src: [`${out}/bower_components/jquery/dist/jquery.min.js`, `${out}/bower_components/bootstrap/dist/js/bootstrap.min.js`, `${out}/bower_components/select2/select2.min.js`, `${out}/bower_components/lscache/lscache.min.js`, `${out}/scripts/custom/polyfills.js`, `${out}/scripts/vendor/jws-3.3.js`, `${out}/build/plugins/embed-hash-persistence.js`],
    dest: `${out}/scripts/`,
    name: 'devportal-yaas-head.min.js'
  },
  {
    src: [`${out}/scripts/general/*.js`],
    dest: `${out}/scripts/`,
    name: 'devportal-yaas.min.js'
  }],
  css: [{
    src: [`${out}/styles/main.css`, `${out}/styles/components/globalnomodal.css`],
    dest: `${out}/styles/`,
    name: 'devportal-yaas.css'
  }],
  html: [{
    src: [`${out}/**/*.html`, `!${out}/error/error.html`, `!${out}/services/**/client/README.html`,  `!${out}/bower_components/**/*.html`],
    dest: `${out}/`,
    opts: {
      collapseWhitespace: true,
      ignoreCustomFragments: [/<div.*class\s*=\s*["']mermaid["']\s*>((.|\n)*?)<\/div>/g]
    }
  }]
};

//add attributes to registry
config.registry.registryPath = `${config.tempLocation}/${config.registry.fileName}`;
config.registry.clonedRegistryFolderPath = `${config.tempLocation}/${config.registry.clonedRegistryFolder}`;
config.registry.shortRegistryPath = `${config.tempLocation}/${config.registry.shortVersionFileName}`;
config.registry.pathFolderWithClonedRegistry = `${config.tempLocation}/${config.registry.clonedRegistryFolder}/registry`;

//add attributes to docu
config.docu.clonedRepoFolderPath = `${config.tempLocation}/${config.docu.clonedRepoFolder}`;

//add attributes to generationResult
config.generationResult.clonedResultFolderPath = `${config.tempLocation}/${config.generationResult.cloneLocation}`;
config.generationResult.pathFolderWithClonedResult = `${config.generationResult.clonedResultFolderPath}`;

//add location with docu files
config.skeletonSrcDestination = `${config.skeletonDestination}/documents`;

module.exports = config;
