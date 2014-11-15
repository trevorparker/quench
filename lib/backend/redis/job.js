'use strict';

var uuid = require('node-uuid');

var Job = function(args) {
  this.id = args.id || uuid.v4();
  this.queue = args.queue || '';
  this.item = args.item || {};
}

Job.create = function(queue, item, cb) {
  var job = new Job({queue: queue, item: item});
  queue._driver.hmset(job.id, item, function(err, res) {
    if (err) return cb(err);
    return cb(null, job);
  });
}

Job.get = function(queue, id, cb) {
  reconstructJob(queue, id, function(err, job) {
    if (err) return cb(err);
    return cb(null, job);
  });
}

Job.prototype.progress = function(progress) {
  var self = this;
  if (arguments.length === 0) progress = 1;

  var currentProgress = self.item.progress || 0;
  var newProgress = currentProgress + progress;
  if (newProgress >= 100) newProgress = 100;

  self.item.progress = newProgress;
  return newProgress;
}

Job.prototype.pass = function(nextQueue, cb) {
  var self = this;
  nextQueue.addJob(self, function(err, res) {
    if (err) return cb(err);
    return cb(null, res);
  });
}

var reconstructJob = function(queue, id, cb) {
  queue._driver.hgetall(id, function(err, item) {
    if (err) return cb(err);
    var job = new Job({id: id, queue: queue, item: item});
    return cb(null, job);
  });
}

module.exports = Job;

