'use strict';
var redis = require('redis');
var job = require('./redis/job');

var Queue = function(name) {
  this.queueKey = '_quenchQueue_' + name;
  this.processingKey = '_quenchProcessing_' + name;
  this._driver = redis.createClient();
};

// add an item to this backend's queue
Queue.prototype.add = function(name, item, cb) {
  var self = this;
  // create job
  var job = Job.create(self, item);
  if (job === null) {
    throw Error('Unable to create job');
  }
  else {
    // add job to queue
    self._driver.lpush(self.queueKey, job.id, function(err, res) {
      if (err) return cb(err);
      return cb(null, {id: job.id, item: item});
    });
  }
};

// take the next available item in this backend's queue
Queue.prototype.take = function(cb) {
  var self = this;
  self._driver.rpoplpush(self.queueKey, self.processingKey,
    function(err, jobId) {
      if (err) return rb(err);
      self._driver.hgetall(jobId, function(err, res) {
        if (err) return cb(err);
        var job = {
          item: res,
          done: function() {
            self._driver.lrem(self.processingKey, 0, jobId,
              function(err) {
                if (err) return cb(err);
                self._driver.del(jobId, function(err) {
                  if (err) return cb(err);
                });
              }
            );
          }
        };

        return cb(null, job);
      });
    }
  );
}

module.exports = Queue;

