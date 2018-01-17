'use strict'

exports.index = bluebird.coroutine(function* (req, res, next) {
    try{
        res.success({status: 'OK'});
    }catch(e) {next(e)}
})