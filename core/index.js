'use strict';

let core = (fw) => {
    let $initialize = false;

    // set framework options
    fw.set('x-powered-by', false);
    fw.set('trust proxy', true);

    // set template engine

    // extend response
    require('./response.js')(fw);
    return {
        init: (rootpath, basepath) => {
            if ($initialize) {
                throw new Error('Application has been initialized!');
            }

            $initialize = true;

            // initialize database connection
            fw.db = require('./dbcore/index.js')({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                log: ENV !== 'production'
            }, rootpath, basepath);

            // load  middlewares
            require('./middlewares.js')(fw, rootpath);

            // load application
            let app = require(rootpath + '/' + basepath);

            // load logger
            // global.myLogger = require('mony-logger')("logs/" + process.env.NAMESPACE + ".log", process.env.NAMESPACE, 102400000, 50, 'trace');

            // load mony-date for conversion date
            // global.monyDate = require('mony-date');

            // load mony-date for conversion date
            // global.monyService = require('mony-service');

            // connect to another service
            // global.monyPermission = require('mony-permission')(monyService);

            // load core functions
            let fn = require('./functions.js')(fw, rootpath, basepath);

            app(fn);

            // non existing route
            fw.use((req, res) => {
                res.notfound('Page not found!');
            });

            // error handler
            fw.use((err, req, res, next) => {
                res.error(err);
            });
        }
    }
}

module.exports = core;