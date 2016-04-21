module.exports = function(myApp){
    var debug = require('debug')('module:storage:orchestrate');
    var orchestrate = require('orchestrate')(myApp.config.ORCHESTRATE_API_KEY);

    if (typeof myApp.storage !== "undefined") {
        debug(':: WARN :: storage '+myApp.storage.module+' already loaded.  module not loaded...');
        return;
    }

    var storage = { module: "orchestrate" };

    storage.initialize = function(){
        debug('initialized...');
    };

    storage.get = function(field, callback) {
        orchestrate.get(myApp.config.ORCHESTRATE_COLLECTION, field)
        .then(function (response) {
            debug('get() - ' + field + ' exists');
            cache = response.body;
            process.nextTick(function() { callback(null, response.body); });
        })
        .fail(function (response) {
            debug('get() - ' + field + ' does NOT exist');
            process.nextTick(function() { callback(true, undefined); });
        });
        return;
    };

    storage.set = function(field, data, callback) {
        orchestrate.merge(myApp.config.ORCHESTRATE_COLLECTION, field, myApp.utils.tryJSONParse(data))
        .then(function () {
            debug('set() - success : ' + field);
            if (typeof callback === "function") {
                process.nextTick(function() { callback(null, data); });
            }
        })
        .fail(function (err) {
            debug('set() - failed : ');
            // console.log(err);
            if (typeof callback === "function") {
                process.nextTick(function() { callback(true, undefined); });
            }
        });
        return;
    };

    myApp.storage = storage;
    debug('loaded...');
};
