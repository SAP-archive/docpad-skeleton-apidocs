var lunrdoc2 = lunrdoc2 || {};
lunrdoc2.indexJson = lunrdoc.indexJson;
lunrdoc2.template = lunrdoc.template;
lunrdoc2.content = lunrdoc.content;
lunrdoc2.noResultsMessage = lunrdoc.noResultsMessage;
lunrdoc2.init = function(e) {
	e = e || {};
	var t = [];
	if (typeof lunrdoc2.indexJson === "undefined") {
		t.push("Lunr: The index is not available. Make sure that lunr_data.js is loaded before this script.")
	}
	var n = {
		inputID: "lunr-input2",
		hiddenID: "lunr-hidden2",
		resultsID: "lunr-results2",
		facetsID: "lunr-facets2"
	};
	for (var r in n) {
		if (typeof e[r] === "undefined") {
			e[r] = n[r]
		}
	}
	lunrdoc2.inputBox = document.querySelector("#" + e.inputID);
	lunrdoc2.hidden = document.querySelector("#" + e.hiddenID);
	lunrdoc2.resultsContainer = document.querySelector("#" + e.resultsID);
	lunrdoc2.facetsContainer = document.querySelector("#" + e.facetsID);
	if (!lunrdoc2.inputBox) {
		t.push("Lunr: An input element with the id " + e.inputID + " must exist on the page.")
	}
	if (t.length > 0) {
		for (var i in t) {
			console.log(t[i])
		}
		return
	}
	lunrdoc2.useFacets = false;
	if (typeof lunrdoc2.facets !== "undefined") {
		lunrdoc2.useFacets = true;
		var s = {};
		for (var i in lunrdoc2.facets) {
			s[lunrdoc2.facets[i].name] = {};
			if (typeof lunrdoc2.facets[i].label !== "undefined") {
				s[lunrdoc2.facets[i].name].label = lunrdoc2.facets[i].label
			}
		}
		lunrdoc2.facets = s;
		lunrdoc2.activeFilters = {};
		if (lunrdoc2.hidden) {
			var o = lunrdoc2.hidden.value;
			if (o) {
				lunrdoc2.activeFilters = JSON.parse(o)
			}
		}
	}
	if (lunrdoc2.useFacets && !lunrdoc2.facetsContainer) {
		lunrdoc2.facetsContainer = document.createElement("div");
		lunrdoc2.facetsContainer.id = e.facetsID;
		lunrdoc2.inputBox.parentNode.appendChild(lunrdoc2.facetsContainer)
	}
	if (!lunrdoc2.resultsContainer) {
		lunrdoc2.resultsContainer = document.createElement("div");
		lunrdoc2.resultsContainer.id = e.resultsID;
		lunrdoc2.inputBox.parentNode.appendChild(lunrdoc2.resultsContainer)
	}
	var u = function(e) {
		e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var t = new RegExp("[\\?&]" + e + "=([^&#]*)"),
			n = t.exec(location.search);
		return n == null ? "" : decodeURIComponent(n[1].replace(/\+/g, " "))
	};
	var a = u("keys");
	if (a) {
		lunrdoc2.inputBox.value = a
	}
	lunrdoc2.idx = lunr.Index.load(lunrdoc2.indexJson);
	lunrdoc2.inputBox.onkeyup = lunrdoc2.doSearch;
	lunrdoc2.doSearch();
};
lunrdoc2.toggleFilter = function(e, t, n) {
	if (typeof lunrdoc2.activeFilters[e] !== "undefined" && typeof lunrdoc2.activeFilters[e][t] !== "undefined") {
		delete lunrdoc2.activeFilters[e][t];
		var r = false;
		for (var i in lunrdoc2.activeFilters[e]) {
			r = true;
			break
		}
		if (!r) {
			delete lunrdoc2.activeFilters[e]
		}
		n.className = ""
	} else {
		if (typeof lunrdoc2.activeFilters[e] === "undefined") {
			lunrdoc2.activeFilters[e] = {}
		}
		if (typeof lunrdoc2.activeFilters[e][t] === "undefined") {
			lunrdoc2.activeFilters[e][t] = {}
		}
		n.className = "active"
	}
};
lunrdoc2.printFacets = function() {
	lunrdoc2.facetsContainer.innerHTML = "";
	for (var e in lunrdoc2.activeFilters) {
		if (typeof lunrdoc2.currentFacets[e] === "undefined") {
			lunrdoc2.currentFacets[e] = {}
		}
		for (var t in lunrdoc2.activeFilters[e]) {
			if (typeof lunrdoc2.currentFacets[e][t] === "undefined") {
				lunrdoc2.currentFacets[e][t] = 0
			}
		}
	}
	for (var n in lunrdoc2.currentFacets) {
		var r = document.createElement("div");
		var i = document.createElement("h3");
		var s = n;
		if (typeof lunrdoc2.facets[n].label !== "undefined") {
			s = lunrdoc2.facets[n].label
		}
		var o = document.createTextNode(s);
		i.appendChild(o);
		var u = document.createElement("ul");
		var a = new lunr.SortedSet;
		var f = {};
		for (var l in lunrdoc2.currentFacets[n]) {
			var c = document.createTextNode(l + " (" + lunrdoc2.currentFacets[n][l] + ")");
			var h = document.createElement("li");
			h.appendChild(c);
			if (typeof lunrdoc2.activeFilters[n] !== "undefined" && typeof lunrdoc2.activeFilters[n][l] !== "undefined") {
				h.className = "active"
			}
			h.onclick = function(e, t) {
				return function() {
					lunrdoc2.toggleFilter(e, t, this);
					lunrdoc2.doSearch()
				}
			}(n, l);
			f[l] = h;
			a.add(l)
		}
		var p = a.toArray();
		for (var d in p) {
			u.appendChild(f[p[d]])
		}
		r.appendChild(i);
		r.appendChild(u);
		lunrdoc2.facetsContainer.appendChild(r)
	}
};
lunrdoc2.doSearch = function() {
	var e = lunrdoc2.inputBox.value;
	lunrdoc2.resultsContainer.innerHTML = "";
	if (e) {
		lunrdoc2.currentFacets = {};
		var t = lunrdoc2.idx.search(e);
		if (t.length === 0) {
			lunrdoc2.resultsContainer.innerHTML = lunrdoc2.noResultsMessage
		} else {
			for (var n in t) {
				var r = lunrdoc2.content[t[n].ref];
				var i = true;
				if (lunrdoc2.useFacets) {
					for (var s in lunrdoc2.activeFilters) {
						if (typeof r[s] === "undefined") {
							i = false;
							break
						} else if (Array.isArray(r[s])) {
							for (var o in lunrdoc2.activeFilters[s]) {
								if (r[s].indexOf(o) == -1) {
									i = false;
									break
								}
							}
						} else {
							for (var o in lunrdoc2.activeFilters[s]) {
								if (r[s] != o) {
									i = false;
									break
								}
							}
						}
					}
				}
				if (i) {
					lunrdoc2.resultsContainer.innerHTML += lunrdoc2.template({
						post: r
					});
					if (lunrdoc2.useFacets) {
						for (var s in lunrdoc2.facets) {
							if (typeof r[s] === "undefined") {
								continue
							}
							if (typeof lunrdoc2.currentFacets[s] === "undefined") {
								lunrdoc2.currentFacets[s] = {}
							}
							if (Array.isArray(r[s])) {
								for (var u in r[s]) {
									if (typeof lunrdoc2.currentFacets[s][r[s][u]] === "undefined") {
										lunrdoc2.currentFacets[s][r[s][u]] = 0
									}
									lunrdoc2.currentFacets[s][r[s][u]] += 1
								}
							} else {
								if (typeof lunrdoc2.currentFacets[s][r[s]] === "undefined") {
									lunrdoc2.currentFacets[s][r[s]] = 0
								}
								lunrdoc2.currentFacets[s][r[s]] += 1
							}
						}
					}
				}
			}
		}
		if (lunrdoc2.useFacets) {
			lunrdoc2.hidden.value = JSON.stringify(lunrdoc2.activeFilters);
			lunrdoc2.printFacets()
		}
	}
};
lunrdoc2.ready = function(e) {
	lunrdoc2.init();
	window.removeEventListener("DOMContentLoaded", lunrdoc2.ready)
};
window.addEventListener("DOMContentLoaded", lunrdoc2.ready)
