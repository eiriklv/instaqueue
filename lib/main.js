// debug dependency
var colors = require('colors');
var async = require('async');
var debug = require('debug')('instaqueue');

// InstaQueue object prototype/constructor
exports = module.exports = function(spaceBetween, maxMessageQueue, action) {
    var startTime = new Date().getTime();
    var nextMessageTime = new Date().getTime() - spaceBetween;
    var messageQueue = 0;
    var timeOutArray = [];
    timeOutArray.length = maxMessageQueue + 1;

    // do requested action
    function trigger(content) {
        action(content);
        debug('performed action at ' + (new Date().getTime() - startTime) / 1000 + 's');
        messageQueue--;
    }

    // reset queue
    this.reset = function reset(callback) {
        // reset timeouts
        timeOutArray.forEach(function(timeout) {
            clearTimeout(timeout);
        });

        // reset variables / counters
        startTime = new Date().getTime();
        nextMessageTime = new Date().getTime() - spaceBetween;
        messageQueue = 0;
        timeOutArray = [];
        timeOutArray.length = maxMessageQueue + 1;
        debug('resetting queue');
        callback();
    };

    // add element to queue
    this.push = function push(content) {
        var currentTime = (new Date()).getTime();

        // check if max queue length is reached
        if (messageQueue > maxMessageQueue) {
            debug('reached queue max, wait for the queue to flush');
            return;
        }

        // check if the message is to be posted immediately, or if it is to be added to the queue
        if (currentTime < (nextMessageTime + spaceBetween)) {
            debug('posting with queue');
            
            messageQueue++;

            // calculate the waiting time for the added task
            var timeToNext = (nextMessageTime + spaceBetween) - currentTime;
            
            // update the time reference of the last item to be executed in the queue
            nextMessageTime = nextMessageTime + spaceBetween;
            
            // set the timeout for the trigger
            var timeout = setTimeout(function() {
                trigger(content);
            }.bind(this), timeToNext);
            
            // push the event and purge the head
            timeOutArray.push(timeout);
            timeOutArray.shift();
        } else {
            debug('posting without queue');
            
            messageQueue++;

            // trigger the action right away
            nextMessageTime = currentTime;
            trigger(content);
        }
    };
};
