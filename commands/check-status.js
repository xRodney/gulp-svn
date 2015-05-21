'use strict';

var exec = require('child_process').exec,
    gutil = require('gulp-util');

module.exports = function (path, options, cb) {

    if(!cb && typeof options === 'function') {
        cb = options;
        options = {};
    }

    if(!cb || typeof cb !== 'function') cb = function() {};
    if(!options) options = {};
    if(!path) path = ' ';
    if(!options.cwd) options.cwd = process.cwd();
    if(!options.args) options.args = ' ';
    
    var cmd = 'svn status ' + path + ' -u ' + options.args;

    if(options.username && options.password) {
        cmd += ' --username '+ options.username + ' --password ' + options.password;
    }

    return exec(cmd, {cwd: options.cwd}, function(err, stdout, stderr){
        if (err) return cb(err);
        if (!options.quiet) gutil.log(stdout, stderr);
		if (stdout.split(/\r?\n\r?/).length > 2) {
			return cb("Repository contains uncommitted changes");
		}
        cb();
    });
};