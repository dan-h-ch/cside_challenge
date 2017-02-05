'use strict'

var requestPromise = require('request-promise')

var storeArr = []

var initialRequest = {
  method: 'GET',
  uri: 'http://challenge.curbside.com/get-session'
}

var getData = function(node) {
  node = node || 'start'
  // get sessionid
  requestPromise(initialRequest)
  .then((sessionId) => {    
    var option = {
      uri: `http://challenge.curbside.com/${node}`,
      headers: {
        session: sessionId
      }
    }
    return option
  })
  .then((option) => requestPromise(option))
  .then((node) => JSON.parse(node.toLowerCase()))
  .then((node) => {
    node
    if (node.next && typeof(node.next) === 'string') {
      node.next = [node.next]
    }
    storeArr.push(node)
    if (node.next) {
      for (var i = 0; i < node.next.length; i++) {
        (function(i) {
          getData(node.next[i])
        })(i)
      }
    }
    return node
  })
  .catch((err) => {
    console.log(JSON.stringify(err, null, 2))
  })
}

var organizedObj = {}

var organize = function(arr) {
  for (var j = 0; j < arr.length; j++) {
    var node = arr[j]
    organizedObj[node.depth] = organizedObj[node.depth] || []
    organizedObj[node.depth].push(node)
  }
}

var answer = []

var print = function(node, depth) {
  depth = depth || 0
  var possibleChildren = organizedObj[depth+1]
  if (node.secret) {
    // console.log('secret', node.secret)
    answer.push(node.secret)
  }
  if (node.next) {
    // create a children collection
    var children = []
    for (var k = 0; k < node.next.length; k++) {
      children.push(possibleChildren.filter(function(item) {
        return item.id === node.next[k]
      })[0])
    }
    // loop through children object
    for (var l = 0; l < children.length; l++) {
      print(children[l], depth+1)
    }
  }  
}

// invoke get data
getData()


setTimeout(function() {
  organize(storeArr)
  print(organizedObj[0][0])
  console.log(answer.join(''))
}, 6000)

