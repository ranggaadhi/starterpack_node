'use strict';

module.exports = (configs, rootpath, basepath) => {
    let {host, user, password, database, log} = configs

    const DB = require('./db.js')(rootpath, basepath);

    global.Sequelize = require('sequelize');
    global.db = new DB;

    db.addConnection('default', {
        host: host,
        user: user,
        password: password,
        database: database,
        log: log ? console.log : false
    }, true);

    return db.connection();
}