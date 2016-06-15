require('./helpers/objectsPrototypes.js');

#variables used many times in docpad.coffee that can be stored like this
deployment = {
  gulp:
    writeAfter:["replaceApiReferences"]
    generateAfter: ['serviceLatest']
  styles: ["/styles/devportal-yaas.css"]
  scripts: ["/scripts/devportal-yaas.min.js"]
  headScripts: ["/scripts/devportal-yaas-head.min.js"]
  apiNotebook: "https://apinotebook.us-east.stage.modules.yaas.io"
  feedbackService: "https://feedback.stage.yaas.io"
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
        "/scripts/general/polyfills.js"
        '/scripts/vendor/jws-3.3.js'
        '/build/plugins/embed-hash-persistence.js'
      ]


      navPersonalizationScripts: [
        '/bower_components/underscore/underscore-min.js'
        #'/scripts/custom/listing.js'
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
        "/scripts/general/search-bar.js"
        "/scripts/general/code-block.js"
        "/scripts/general/simplePagination.js"
        "/scripts/general/blog.js"
        "/scripts/general/img-click-modal.js"
        "/scripts/general/ZeroClipboard-min.js"
        "/scripts/general/sequence_nav.js"
        "/scripts/general/apiref.js"
        "/scripts/general/left-nav-indicators.js"
        "/scripts/general/replace-svg-images-with-inline-svg.js"
        "/scripts/general/api-filter.js"
        "/scripts/general/api-console.js"
        "/scripts/general/y-factors.js"
        "/scripts/general/ignore-scrolling.js"
      ]


      styles: [
        "/styles/main.css"
        "/styles/components/super-nav.css"
      ]

      # The production url of our website
      url: "http://127.0.0.1:9778"
      yaasUrl: "https://www.yaas.io"
      home: ""

      apinotebookService : "http://localhost:3000"
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


    getApinotebookService: ->
      @site.apinotebookService

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


  # =================================
  # Collections
  # These are special collections that our website makes available to us

  collections:

    # Get all rn sorted by order meta
    releaseNotes: ->
      @getCollection("documents")
        .findAllLive({url:$startsWith: "/rn"},[filename:-1,service:1])

    # Get all rn sorted by order meta
    apiconsoles: ->
      @getCollection("documents")
        .findAllLive(
          {url:{$startsWith: "/apiconsoles"},
          filename: 'meta-inf'},
          [filename:-1,service:1])

    # Get all services sorted by order meta
    services: ->
      @getCollection("documents")
        .findAllLive(
          {url:$startsWith: "/services"},
          [order:1,service:1])

    # Get all rn sorted by order meta + paging included
    posts: ->
      @getCollection('html')
        .findAllLive(
          {isPagedAuto:{$ne: true},
          basename:{$nin: ['index', 'release_notes']},
          filename:{$ne: 'meta-inf'},
          url:{$startsWith:"/rn"}},
          [filename:-1]).on "add", (model) ->
            model.setMetaDefaults(layout:"post")

    searchServices: ->
      @getCollection('documents')
        .findAllLive({
          extension: {$in:['md', 'html', 'eco']},
          title: {$exists: true},
          url: {$startsWith: "/services"},
          relativeOutDirPath:{$ne: 'services'}}).on "add", (model) ->
            model.setMetaDefaults({layout:"document",result:true})

  # =================================
  # Plugins

  plugins:

    text:
      matchElementRegexString: 't'

    gulp:
      writeAfter: ['replaceApiReferences']
      generateAfter: ['serviceLatest', 'fixTables']

    lunr:
      indexes:
        myIndex:
          collection: ['searchServices']

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
          url: ""
          blogFeed: "/atom.xml"
          googleAnalytics: deployment.googleAnalytics
          scripts: deployment.scripts
          headScripts: deployment.headScripts
          styles: deployment.styles
          apinotebookService : "https://apinotebook.us-east.modules.yaas.io"

      plugins:
        gulp: deployment.gulp

}

# Export our DocPad Configuration
module.exports = docpadConfig
