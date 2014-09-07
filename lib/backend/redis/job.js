'use strict';

var uuid = require('node-uuid');

var Job = function(id, queue, item) {
  this.id = id || uuid.v4();
  this.queue = queue;
}

Job.create = function(queue, item, cb) {
  var job = new Job(null, queue, item);
  queue._driver.hmset(job.id, item, function(err, res) {
    if (err) return cb(err);
    return cb(null, job);
  });
}

module.exports = Job;

