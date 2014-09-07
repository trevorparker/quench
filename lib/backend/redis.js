'use strict';
var redis = require('redis');
var redisJob = require('./redis/job');

var Queue = function(name) {
  this.queueKey = '_quenchQueue_' + name;
  this.processingKey = '_quenchProcessing_' + name;
  this._driver = redis.createClient();
};

// add an item to this backend's queue
Queue.prototype.add = function(name, item, cb) {
  var self = this;
  // create job
  redisJob.create(self, item, function(err, res) {
    if (err) return cb(err);

    var jobResult = res;
    self._driver.lpush(self.queueKey, res.id, function(err, res) {
      if (err) return cb(err);
      return cb(null, {id: jobResult.id, item: item});
    });
  });
};

// take the next available item in this backend's queue
Queue.prototype.take = function(cb) {
  var self = this;
  self._driver.rpoplpush(self.queueKey, self.processingKey,
    function(err, jobId) {
      if (err) return cb(err);
      if (jobId == null) return cb(new Error('No more jobs'));
      redisJob.get(self, jobId, function(err, job) {
        if (err) return cb(err);
        return cb(null, job);
      });
    }
  );
}

module.exports = Queue;

