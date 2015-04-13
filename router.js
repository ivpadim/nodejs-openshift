var Profile = require('./profile.js');
var renderer = require('./renderer.js');
var querystring = require('querystring');

var commonHeaders = {'Content-Type':'text/html'};

//Handle HTTP route GET / and POST / i.e. Home´
function home(request, response){
  //if url == "/" && GET
  if(request.url == "/"){
    //show search
    if(request.method.toLowerCase() == "get"){
      response.writeHead(200, commonHeaders);
      renderer.view('header', {}, response);
      renderer.view('search', {}, response);
      renderer.view('footer', {}, response);
      response.end();
    }
    else{
      //if url == "/" && POST
      //get the post data from body
      request.on('data', function(postBody){
        var query = querystring.parse(postBody.toString());
        //redirect to /:username
        response.writeHead(303, {'Location' : '/' + query.username});
        response.end();
      });
    }
  }
}

//Handle HTTP route GET /:username i.e. /ivpadim
function user(request, response){
  //if url == "/..."
  var username = request.url.replace('/','');
  if(username.length > 0){
    response.writeHead(200, commonHeaders);
    renderer.view('header', {}, response);


    //get json from Treehouse
    var studentProfile = new Profile(username);
    //on "end"
    studentProfile.on("end", function(profileJson){
      //show profile

      //Store the values which we need
      var values = {avatarUrl: profileJson.gravatar_url,
        username: profileJson.profile_name,
        badges: profileJson.badges.length,
        javascript: profileJson.points.JavaScript
      };

      //Simple response
      renderer.view('profile', values, response);
      renderer.view('footer', {}, response);
      response.end();
    });

    //on "error"
    studentProfile.on("error", function(error){
      //show error
      renderer.view('error', {errorMessage : error.message}, response);
      renderer.view('search', {}, response);
      renderer.view('footer', {}, response);
      response.end();
    });




  }
}

module.exports.home = home;
module.exports.user = user;
