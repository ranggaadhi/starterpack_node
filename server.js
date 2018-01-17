'use strict';

require('dotenv').config({path: __dirname + '/.env'});

// set application environment
global.ENV = process.env.NODE_ENV || 'development';
global.async = require('async');
global.Sequelize = require('sequelize');
//bluebird package
global.bluebird = require("bluebird");


const port = 8888;
const express = require('express');
const fw = express();
const core = require('./core')(fw, __dirname);

core.init(__dirname, 'apps/v1');

fw.listen(port);

module.exports = fw
