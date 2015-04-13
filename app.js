var router = require('./router.js');
//Problem: We need a simple way to look at user's badge count and Javascript point from a web browser
//Solution: User Node.js to perform the profile look ups and server our template via HTTP

//Create a web server
var http = require('http');
http.createServer(function(request, response){
  router.home(request, response);
  router.user(request, response);
}).listen(8888)

console.log('Server running at http://localhost:8888/')
