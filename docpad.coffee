require('./helpers/objectsPrototypes.js');
gulpFunctions = require('./gulpFunctions.js');
validate = require('./helpers/validateMetadata.js')
config = require('./chewieConfig');


#variables used many times in docpad.coffee that can be stored like this
deployment = {
  functions:
    writeAfter: [gulpFunctions.replaceApiReferences]
    generateAfter: [gulpFunctions.fixTables, gulpFunctions.fixLinks, gulpFunctions.serviceLatest]
    docpadReady: [validate]
  styles: ["/styles/devportal-yaas.css"]
  scripts: ["/scripts/devportal-yaas.min.js"]
  headScripts: ["/scripts/devportal-yaas-head.min.js"]
}

docpadConfig = {

  pluginsPaths: [  # default
        'node_modules'
        'plugins'
    ]

  # =================================
  # Template Data
  # These are variables that will be accessible via our templates
  templateData:

    watchOptions: preferredMethods: ['watchFile','watch']
    # Specify some site properties
    site:

      # Scripts
      headScripts: [
        "/bower_components/jquery/dist/jquery.min.js"
        "/bower_components/bootstrap/dist/js/bootstrap.min.js"
        "/bower_components/select2/select2.min.js"
        "/bower_components/lscache/lscache.min.js"
        "/scripts/custom/polyfills.js"
        "/bower_components/kjur-jsrsasign/jws-3.3.js"
        "/build/plugins/embed-hash-persistence.js"
        "/scripts/custom/jquery-custom-animations.js"
        "/scripts/custom/jquery-custom-prototypes.js"
      ]

      navPersonalizationScripts: [
        "/bower_components/underscore/underscore-min.js"
        #"/scripts/custom/listing.js"
      ]

      scripts: [
        "/scripts/general/opt-in-features.js"
        "/scripts/general/modernizr.js"
        "/scripts/general/offcanvas.js"
        "/scripts/general/backtop.js"
        "/scripts/general/scrollspy.js"
        "/scripts/general/remember_location.js"
        "/scripts/general/ZeroClipboard-min.js"
        "/scripts/general/expand-collapse.js"
        "/scripts/general/code-block.js"
        "/scripts/general/img-click-modal.js"
        "/scripts/general/apiref.js"
        "/scripts/general/left-nav-indicators.js"
        "/scripts/general/replace-svg-images-with-inline-svg.js"
        "/scripts/general/api-filter.js"
        "/scripts/general/api-console.js"
        "/scripts/general/ignore-scrolling.js"
        "/scripts/general/add-margin-to-content-with-sticky-header.js"
        "/scripts/general/load-tutorial.js"
        "/scripts/general/mermaid.js"
        "/scripts/general/startMermaid.js"
      ]

      styles: [
        "/styles/main.css"
        "/styles/7-components/super-nav.css"
      ]

      # The production url of our website
      url: if process.env.DEPLOY then config.docuUrl else 'http://127.0.0.1:9778'
      yaasUrl: "https://www.yaas.io"
      home: ""

      googleAnalytics: () -> ''

      # The default title of our website
      title: "Simple API Docs Skeleton"

      # The website description (for SEO)
      description: "Skeleton for your API Documentation"

      # The website keywords (for SEO) separated by commas
      keywords: ""

      # The website author's name
      author: ""


    # -----------------------------
    # Helper Functions


    # helper used in several placeholders to build navigation links
    # out of service's names or titles. Removes all spaces and special chars

    getSiteUrl: ->
      @site.url

    getYaasUrl: ->
      @site.yaasUrl

    getHomeUrl: ->
      @site.home

    getTrimmedName: (name) ->
      name.replace(/([^\w-])/g,"")

    #gets a docpad object's relativeDirPath on input
    getVersion: (path, allowedArrayLength) ->
      #need to cut out the version out of the path
      fullPathArray = path.split('/')
      # need to make sure nobody messed up with their
      # docu structure and it is docu/files/flet.html.md
      if !(fullPathArray.length > allowedArrayLength)
        fullPathArray[fullPathArray.length-1]
      else "Version name on last position in the path "+path+" is not char + one or two digits"

    getVersionDigit: (path, allowedArrayLength) ->
      fullPathArray = path.split('/')
      # need to make sure nobody messed up with their
      # docu structure and it is docu/files/flet.html.md
      if !(fullPathArray.length > allowedArrayLength)
        fullVersion = fullPathArray[fullPathArray.length-1]
        #need to get a version number and be ready for 2 digits versions
        if fullVersion.length is 3
          fullVersion.slice(1,3)
        else if fullVersion.length is 2
          fullVersion.slice(1)
      else "Version name on last position in the path "+path+" is not char + one or two digits"

    # Get the prepared site/document title
    # Often we would like to specify particular formatting to our page's title
    # we can apply that formatting here
    getPreparedTitle: ->
      # if we have a document title,
      # then we should use that and suffix the site's title onto it
      if @document.title
        "#{@document.title} | #{@site.title}"
      # if our document does not have it's own title,
      # then we should just use the site's title
      else
        @site.title

    # Get the prepared site/document description
    getPreparedDescription: ->
      # if we have a document description, then we should use that,
      # otherwise use the site's description
      @document.description or @site.description

    # Get the prepared site/document keywords
    getPreparedKeywords: ->
      # Merge the document keywords with the site keywords
      @site.keywords.concat(@document.keywords or []).join(', ')

    trimTo140Char: (content) ->
      if content.length > 140
        content.substr(0, 140) + '...'
      else
        content

    removeRedundantMeta: (content) ->
      findMeta = content.indexOf('---', 3)
      if(findMeta == -1) # if no meta - probably will never happen
        return content
      return '\n' + content.substr(findMeta + 3) + '\n' # add because indexOf returns index of first character, we need to trim to last
                                                        # added \n at the begining and end so it will render properly

  # =================================
  # Collections
  # These are special collections that our website makes available to us

  collections:

    # Get all rn sorted by order meta
    releaseNotes: ->
      @getCollection("documents")
        .findAllLive({url:$startsWith: "/rn"},[filename:-1])

    # Get all rn sorted by order meta
    apiconsoles: ->
      @getCollection("documents")
        .findAllLive(
          {url:{$startsWith: "/apiconsoles"},
          filename: 'meta-inf'},
          [filename: 1])

    # Get all services sorted by order meta
    services: ->
      @getCollection("documents")
        .findAllLive(
          {url:$startsWith: "/services"},
          [order:1, filename:1])

    # Get all tools sorted by order meta
    solutions: ->
      @getCollection("documents")
        .findAllLive(
          {url:$startsWith: "/solutions"},
          [order: 1, filename: 1])

    # Get all rn sorted by order meta + paging included
    posts: ->
      @getCollection('html')
        .findAllLive(
          {isPagedAuto:{$ne: true},
          basename:{$nin: ['index', 'release_notes']},
          filename:{$ne: 'meta-inf'},
          url:{$startsWith:"/rn"}},
          [filename: -1]).on "add", (model) ->
            model.setMetaDefaults(layout:"post")

    # Get all services sorted by order meta
    APINotebooks: ->
      @getCollection("documents")
        .findAllLive({
          interactive: {$exists: true}
        })


    #################################
    # COLLECTIONS FOR CONTENT       #
    #################################

    servicesContent: ->
      @getCollection('services')
        .findAllLive({ basename: {$nin: ['meta-inf', 'index']}, title: {$exists: true, $ne: null} })

    solutionsContent: ->
      @getCollection('solutions')
        .findAllLive({ basename: {$nin: ['meta-inf', 'index']}, title: {$exists: true, $ne: null} })

    postsContent: ->
      @getCollection('posts')
        .findAllLive({ headline: {$exists: true, $ne: null} })

  # =================================
  # Plugins

  plugins:

    text:
      matchElementRegexString: 't'

    functions:
      writeAfter: [gulpFunctions.replaceApiReferences]
      generateAfter: [gulpFunctions.fixTables, gulpFunctions.serviceLatest]
      docpadReady: [validate]

    # customize marked to use mermaid diagrams
    marked: require './helpers/markedRenderer.js'

  # =================================
  # DocPad Events

  # Here we can define handlers for events that DocPad fires
  # You can find a full listing of events on the DocPad Wiki
  events:

    # Server Extend
    # Used to add our own custom routes
    # to the server before the docpad routes are added
    serverExtend: (opts) ->
      # Extract the server from the options
      {server} = opts
      docpad = @docpad

  # =================================
  #   * Environments
  #

  environments:
    prod:
      templateData:
        site:
          url: "http://yaas.github.io/chewie-sample-result"
          blogFeed: "/atom.xml"
          googleAnalytics: deployment.googleAnalytics
          scripts: deployment.scripts
          headScripts: deployment.headScripts
          styles: deployment.styles

      plugins:
        gulp: deployment.gulp

}

# Export our DocPad Configuration
module.exports = docpadConfig
