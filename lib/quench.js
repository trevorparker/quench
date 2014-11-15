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
  var self = this;
  self._backend = new Backends[options.backend](options.name);
};

Client.prototype.add = function(name, item, cb) {
  var self = this;
  return self._backend.add(name, item, cb);
};

Client.prototype.addJob = function(job, cb) {
  var self = this;
  return self._backend.addJob(job, cb);
};

Client.prototype.take = function(name, item, cb) {
  var self = this;
  return self._backend.take(name, item, cb);
};

module.exports = Queue;

