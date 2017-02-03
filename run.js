'use strict'

var requestPromise = require('request-promise')

var initialRequest = {
  method: 'GET',
  uri: 'http://challenge.curbside.com/get-session'
}

var getData = function(node) {
  node = node || 'start'
  // always get sessions id to avoid expired/used up
  requestPromise(initialRequest)
  .then((sessionId) => {    
    var option = {
      uri: `http://challenge.curbside.com/${node}`,
      headers: {
        session: sessionId
      }
    }
    console.log(option.uri)
    return option
  })
  .then((option) => requestPromise(option))
  .then((node) => JSON.parse(node))
  .then((node) => {
    // one node happens to have single element NOT in an array
    console.log(node)
    if (node.next && Array.isArray(node.next)) {
      for (var i = 0; i < node.next.length; i++) {
        getData(node.next[i])
      }
    } else {
      console.log(node)
    }
  })
  .catch((err) => console.log(JSON.stringify(err, null, 2)))
}

getData()
