quench
======

A backend-agnostic job queue.

Ideas
-----

The general direction I'm going for is expressed in these code snippets. Some of this is implemented while other parts are not.

### Creating / accessing a queue

```js
var widgetQueue = require('quench')({backend: 'redis', name: 'widgets'});
var shippingQueue = require('quench')({backend: 'redis', name: 'shipping'});
```

### Creating a new job in a queue

```js
widgetQueue.add('my first widget', {
  color: 'red',
  size: 'large'
}, function(err, res) {});

// Create a second one, and so on ...
widgetQueue.add('a widget for bob', {
  color: 'purple',
  size: 'medium'
}, function(err, res) {});
```

### Taking a job from a queue

```js
widgetQueue.take(function(err, job) {
  // Do some work ...

  // Update progress
  job.progress(100);

  // We're done!
  job.done();
});
```

### Passing a job to another queue

```js
widgetQueue.take(function(err, job) {
  // Do some work ...

  // Update progress
  job.progress(15);

  // I've done all I can, pass it to someone else
  job.pass(shippingQueue, function(err, res) {});
});
```

### Marking a job as failed

```js
shippingQueue.take(function(err, job) {
  // Do some work ...

  // Uh-oh, the delivery failed
  job.fail(Error("Your widget couldn\'t be delivered"));
});
```

