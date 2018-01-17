'use strict';

let loadMiddlewares = (app, rootpath) => {
    const bodyParser = require('body-parser');
    const assets = require('connect-assets');
    const expressSanitizer = require('express-sanitize-escape')

    // serve public
    app.use(assets({
        paths: [
            rootpath + '/public',
            rootpath + '/storages/uploads'
        ],
        build: false,
        servePath: 'web'
    }));

    // body parser for json-encoded
    app.use(bodyParser.json({
        // maximum request body size
        // use https://www.npmjs.com/package/bytes as reference for defining byte calculation
        limit: '100kb',
        'strict': false
    }));

    // body parser for url-encoded
    app.use(bodyParser.urlencoded({
        limit: '100kb',
        // parsing the URL-encoded data with the querystring library (false) or qs library (true)
        extended: false
    }));

    // express sanitize (anti-XSS)
    app.use(expressSanitizer.middleware())

    //begin get & set header data
    let setHeaders = function (req, res, next) {
        // myLogger.info('new-request', req.headers);
        // if (req.headers.hasOwnProperty('mony-user-data')) {
        //     req.user = JSON.parse(req.headers['mony-user-data']);
        // }else{
        //     throw new Error('Invalid User Information!');
        // }
        next();
    }

    app.use(setHeaders);
    //end get & set header data


    if (ENV !== 'production') {
        // for environment other than production
        let morgan = require('morgan');

        app.use(morgan('dev'));
    } else {
        // for environment only on production
    }
}

module.exports = loadMiddlewares;