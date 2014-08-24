'use strict';

var Backends = {
  'redis' : require('./backend/redis' )
};

var Queue = function(options) {
  var backend = options.backend;

  if (backend in Backends) {
    return new Client(options);
  }

  throw new Error('Backend \'' + backend + '\' is not valid');
};

var Client = function(options) {
  this._backend = new Backends[options.backend];
};

Client.prototype.add = function() {
  return this._backend.add.apply(this, arguments);
};

module.exports = Queue;

