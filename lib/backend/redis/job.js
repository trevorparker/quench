'use strict';

var uuid = require('node-uuid');

var Job = function(queue, item) {
  this.id = uuid.v4();
  this.queue = queue;
}

Job.create = function(queue, item) {
  var job = new Job(queue, item);
  queue._driver.hmset(job.id, item, function(err, res) {
    if (err === null) {
      return job;
    }
  });
}

module.exports = Job;

