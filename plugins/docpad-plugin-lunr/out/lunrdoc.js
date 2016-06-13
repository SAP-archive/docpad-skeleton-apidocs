var lunr = require('lunr');
var fs = require('fs');

module.exports = {
  /*
   * This instantiates the Lunr index and a container object for content
   */
  init: function(docpad) {
    var config = docpad.config.plugins.lunr;
    if (typeof config === 'undefined' || typeof config.indexes === 'undefined') {
      console.log('LUNR: This plugin will not work until at least 1 index is defined in the Docpad configuration file.');
      return;
    }
    // default config to use
    var defaults = {
      indexFields: [
        { name: 'title', boost: 2 },
        { name: 'body', boost: 1 }
      ],
      // all fields that will be displayed in the search results
      contentFields: [
        { name: 'title' },
        { name: 'url' },
        { name : 'service' },
        { name : 'type' }
      ],
      resultsTemplate: function(context) {
        var post = context.post;
        if(!post.service && post.type){
          return '<div><a href="' + post.url + '">' + post.title + '</a><span> part of ' + post.type + '</span></div>';
        }
        return '<div><a href="' + post.url + '">' + post.title + '</a><span> part of ' + post.service + '</span></div>';
      },
      noResultsMessage: '<div class=no-results>Sorry, there are no results for that search term.</div>'
    };
    // set up the default options
    if (typeof config.indexes.default === 'undefined') {
      config.indexes.default = defaults;
    } else {
      for (var prop in defaults) {
        if (typeof config.indexes.default[prop] === 'undefined') {
          config.indexes.default[prop] = defaults[prop];
        }
      }
    }
    // now copy the default options onto any indexes with omitted options
    for (var index in config.indexes) {
      if (index == 'default') {
        continue;
      }
      for (var prop in config.indexes.default) {
        if (typeof config.indexes[index][prop] === 'undefined') {
          config.indexes[index][prop] = config.indexes.default[prop];
        }
      }
    }
    // we now have no use for the "default" index so delete it
    delete config.indexes.default;

    // give warning message if any collections are missing
    for (var index in config.indexes) {
      if (typeof config.indexes[index].collection === 'undefined') {
        console.log('LUNR: The "' + index + '" index will be ignored because a collection is not specified.');
      }
    }
    // save the base directory location
    config.baseLocation = docpad.config.outPath + '/lunr';
    // save some more values for later
    config.rootPath = docpad.config.rootPath;
    // now we loop through all the indexes
    for (var index in config.indexes) {
      // make sure its directory exists
      config.indexes[index].indexFilename = 'lunr-data-' +
        index.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.json';
      // create a Lunr index
      var idx = new lunr.Index;
      // add Lunr's stopword filter and stemmer
      var stopWordFilter = lunr.stopWordFilter;
      // add any stopwords
      if (typeof config.indexes[index].stopWords !== 'undefined') {
        for (var i in config.indexes[index].stopWords) {
          stopWordFilter.stopWords.add(config.indexes[index].stopWords[i]);
        }
      }
      idx.pipeline.add(stopWordFilter, lunr.stemmer);
      // set up the fields for the index
      for (var i in config.indexes[index].indexFields) {
        var boost = config.indexes[index].indexFields[i].boost || 1;
        var name = config.indexes[index].indexFields[i].name;
        idx.field(name, { 'boost': boost });
      }
      // the document unique identifier will always be cid
      idx.ref('cid');
      // store the index
      config.indexes[index].idx = idx;
      // prep object for storing all the content of the indexed items
      config.indexes[index].content = {};
      // make sure that there are no facet fields that are not present in
      // the content fields (since facet functionality is currently a
      // "poor-man's" version that happens outside of Lunr)
      if (typeof config.indexes[index].facetFields !== 'undefined') {
        for (var i in config.indexes[index].facetFields) {
          var facetInContent = false;
          var facetField = config.indexes[index].facetFields[i].name;
          for (var j in config.indexes[index].contentFields) {
            contentField = config.indexes[index].contentFields[j].name;
            if (contentField == facetField) {
              facetInContent = true;
              break;
            }
          }
          if (!facetInContent) {
            config.indexes[index].contentFields.push({ name: facetField });
          }
        }
      }
    }
    this.config = config;
  },
  /*
   * This indexes one item and gathers its content
   */
  index: function(index, model) {
    var itemToIndex = {};
    // index all available fields for the item
    for (var i in this.config.indexes[index].indexFields) {
      var name = this.config.indexes[index].indexFields[i].name;
      if (typeof model[name] !== 'undefined' &&
          model[name] !== null) {
        var value = model[name];
        // first convert arrays to strings (we assume they are arrays of strings)
        if (Array.isArray(value)) {
          value = value.join(' ');
        }
        itemToIndex[name] = value;
      } else {
        itemToIndex[name] = '';
      }
    }
    // set the unique identifier
    itemToIndex.cid = model.cid;
    // index the item
    this.config.indexes[index].idx.add(itemToIndex);

    var itemForContent = {};
    // save all available content for the item
    for (var i in this.config.indexes[index].contentFields) {
      var name = this.config.indexes[index].contentFields[i].name;
      if (typeof model[name] !== 'undefined' &&
          model[name] !== null) {
        itemForContent[name] = model[name];
      }
    }
    // save it, keyed to its cid, for easy retrieval
    this.config.indexes[index].content[model.cid] = itemForContent;
  },
  /*
   * This serializes and writes to disk all data for the your client-side
   * search implementation. It copies over my own implementation as well
   * (including poor-man's facets) which you can ignore if not needed.
   */
  save: function() {
    var location = this.config.baseLocation;
    // make sure it exists
    try {
      fs.mkdirSync(location);
    } catch (err) {
      // assume it's already there
    }
    for (var index in this.config.indexes) {
      var filename = this.config.indexes[index].indexFilename;
      var file = fs.openSync(location + '/'+ filename, 'w+');
      // start the file with an object for namespacing purposes
      // append the json for the search index
      var lunrTest = {
        indexJson: this.config.indexes[index].idx.toJSON(),
        content: this.config.indexes[index].content,
        facets: this.config.indexes[index].facetFields,
        noResultsMessage: this.config.indexes[index].noResultsMessage
      };
      fs.writeSync(file, JSON.stringify(lunrTest));
      fs.closeSync(file);
      // finished with that file
    }
    // next copy the client files
    var clientFiles = {
      'lunr-ui.min.js': __dirname + '/',
      'lunr.min.js': __dirname + '/../node_modules/lunr/'
    };
    var destDir = location + '/';
    for (var filename in clientFiles) {
      var destFile = fs.openSync(destDir + filename, 'w+');
      var source = fs.readFileSync(clientFiles[filename] + filename, { encoding: 'utf8' });
      fs.writeSync(destFile, source);
      fs.closeSync(destFile);
    }
  },
  // some helper functions we'll provide to the template
  getLunrSearchBlock: function(searchPage, placeholder, submit) {
    placeholder = placeholder || 'Search terms';
    searchPage = searchPage || 'search.html';
    submit = submit || 'Go';
    return '<form method="get" action="/' + searchPage + '">' +
      '<input type="text" class="search-bar" name="keys" autocomplete="on" placeholder="' + placeholder + '" />' +
      '<input type="submit" value="' + submit + '" />' +
      '</form>';
  }
}
