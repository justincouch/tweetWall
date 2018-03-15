// var http    = require( 'http' );
// var express   = require( "express" );
var path    = require( "path" );
var Twitter = require('twitter');

// var routes         = require( "./routes/index" );
var express = require('express');
var app = express();
var http = require('http');

var PORTNUMBER = 9001;






app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});





var server  = http.createServer(app).listen( PORTNUMBER, function(){
  console.log( "" );
  console.log( "Main server connected. Listening on port %d", server.address().port );
  console.log( "" );
} );




var SEARCH_PARAMS = {
  q:'@_Continuum',
  tweet_mode:'extended',
  count:'100',
  include_entities:'true'
};

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  console.log( 'Socket connected: ' + socket.id );

  //socket.emit('tweet', {text:"test text", source:"@joe"});
  client.get('search/tweets', SEARCH_PARAMS)
    .then(function(value){
      console.log(value);
      console.log(value.statuses.length);
      for( var i=0; i<value.statuses.length; i++ ){
        io.emit( 'tweet', value.statuses[i] );
      }
    })
    .catch(console.error)

  socket.on('disconnect', function () {
    console.error( "DISCONNECT" );
  });
});









var client = new Twitter({
  consumer_key: "2FwwEfgwIchclqtusLfSOUb24",
  consumer_secret: "M4A8eKelf2tjbEUkTlCa1kSootjaY0YHgQGXy8Jc2HqzbZtDax",
  access_token_key: "523620573-EnksnRQ3iy5o3aZLjKV7WpUGOn3jn2x0c7bqsxOG",
  access_token_secret: "bbprjTvm4Wrf3GroiVFIF6kOwuNt9R0btRsczYqE9coJa"
});



// client.get('search/tweets', {q:'#bostondesignweek',tweet_mode:'extended'})
//   .then(function(value){
//     console.log(value);
//     console.log(value.statuses.length);
//   })
//   .catch(console.error)


/**
 * Stream statuses filtered by keyword
 * number of tweets per second depends on topic popularity
 **/
client.stream('statuses/filter', {track: '@_Continuum,@EPAMSYSTEMS'},  function(stream) {
  stream.on('data', function(tweet) {
    if ( tweet.text != undefined ){
      console.log(tweet.user.screen_name + " - " + tweet.user.name);
      console.log("  " + tweet.text);
      console.log("  " + tweet.source);
      io.emit( 'tweet', tweet );
    }
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});
