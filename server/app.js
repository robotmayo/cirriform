'use strict';
// because bluebird is fucking awesome
global.Promise = require('bluebird');
const Hapi = require('hapi');
const server = new Hapi.Server();
const Joi = require('joi');
const crypto = require('crypto');
const randomBytes = function(l){
  return crypto.randomBytes(l || 8).toString('hex');
}
const fs = require('fs');
const fileType = require('file-type');
const path = require('path');
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

server.route({
  method : 'POST',
  path : '/api/upload',
  config : {
    payload : {
      maxBytes : 1048576 * 20,
      output : 'stream',
      parse : true
    },
    validate : {
      payload : {
        file : Joi.any(),
        filename : Joi.string().length(256).optional()
      }
    }
  },
  handler : function(request, reply){
    let name = request.payload.filename;
    const storageID = randomBytes();
    if(typeof request.payload.filename !== 'string') name = '';
    let ws = fs.createWriteStream(path.join(`./${storageID}`));
    request.payload.file.pipe(ws);
    request.payload.file.on('error', function(err){
      console.log(err);
    })
    request.payload.file.on('end', function(){
      reply('done');
      console.log('END');
    });
  }
})
