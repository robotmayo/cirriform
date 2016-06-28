'use strict';
// because bluebird is fucking awesome
global.Promise = require('bluebird');
const Hapi = require('hapi');
const server = new Hapi.Server();
server.connection({port : 8000});

server.start(err => {
  if(err) throw err;
  console.log('Server running at:', server.info.uri);
});

server.route({
  method : 'GET',
  path : '/',
  handler : function (request, reply){
    reply('Just need something for the intial commit');
  }
});


