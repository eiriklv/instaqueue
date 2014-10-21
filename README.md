InstaQueue
==========

Very simple message/action queue system for both node and browser (browserify), where you define the minimum space between the actions,
the maximum queue before ignoring requests, and the action you want to perform. Just for fun :)

===============

### Usage

#### var InstaQueue = require('instaqueue')
#### var queue = new InstaQueue(spaceBetween, maxLength, action)

###### Arguments
* spaceBetween - time in ms between each item in the queue
* maxLength - maximum amount of items in the queue at the same time before ignoring requests
* action(input) - callback to be executed when the queue item is triggered

#### queue.push(input)

###### Arguments
* input - this could be both both an object or a function to be executed, depending on the action used in the constructor (see examples)

#### queue.reset(callback)

###### Arguments
* callback(err) - callback is called with `null` for success, or an error object if it fails

#### queue.setDebug(enable)

###### Arguments
* enable - `true` or `false` for enabling or disabling verbose debugging (off by default) 

==============

### Examples
* Defining a function to be executed with input (in this case console.log)

```javascript
var InstaQueue = require('instaqueue');

// queue with minimum 3 seconds between each item
var myQueue = new InstaQueue(3000, 5, function(input){
    console.log(input);
});

// add item to queue
myQueue.push('dull message');
```

* Defining a function that executes the input as a callback

```javascript
var InstaQueue = require('instaqueue');

// queue with minimum 3 seconds between each item
var myQueue = new InstaQueue(3000, 5, function(input){
    input();
});

// add item to queue
myQueue.push(function(){
    console.log('callback message');
});
```

* Resetting the queue

```javascript
var InstaQueue = require('instaqueue');

// queue with minimum 5 seconds between each item
var myQueue = new InstaQueue(5000, 5, function(input){
    input();
});

// this will be executed
setTimeout(function(){
	myQueue.push(function(){
	    console.log('callback message');
	});
}, 1000);

// this will not be executed, since a reset is called before the queue gets to fire the execution
setTimeout(function(){
	myQueue.push(function(){
	    console.log('callback message');
	});
}, 1500);

// reset the queue
setTimeout(function(){
	myQueue.reset(function(err){
		if(!err) console.log('successfully reset queue..');
	})
}.bind(this), 2000); // reset the queue, deleting all items queued that has not been fired

```