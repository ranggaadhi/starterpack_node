'use strict';

let fn = (fw, rootpath, basepath) => {
    const path = require('path');
    const fn = {}

    // attach rootpath and basepath
    fn.rootpath = rootpath;
    fn.basepath = basepath;

    // set main router
    fn.router = (param) => {
        const router = require('express').Router();

        param(fn, router);

        fw.use(router);
    }

    // require a route file
    fn.route = (routeName) => {
        let callback = require(path.normalize(rootpath + '/' + basepath + '/routes/' + routeName.toLowerCase() + '.js'));

        const router = require('express').Router();

        callback(fn, router);

        return router;
    }

    // require a filter file
    fn.filter = (filterName) => require(path.normalize(rootpath + '/' + basepath + '/filters/' + filterName.toLowerCase() + '.js'));

    // require a controller file
    fn.controller = (controllerName) => {
        return require(path.normalize(rootpath + '/' + basepath + '/controllers/' + controllerName.toLowerCase() + '.js'));
    }

    // attach uploaded file handler on route
    fn.handleFile = require('./filehandler.js')(rootpath + '/' + process.env.UPLOAD_DIR);

    // attach database handling on framework request object
    fw.request.db = fw.db;

    // attach lib function on framework request object
    fw.request.lib = (libName) => require(path.normalize(rootpath + '/' + basepath + '/libs/' + libName.toLowerCase() + '.js'));

    return fn;
}

module.exports = fn;
