'use strict';

module.exports = fw => {
    fw.use((req, res, next) => {
        res.success = (data, statusCode = 200) => {
            res.status(statusCode).json({
                status: 'success',
                statusCode: statusCode,
                payload: data || {}
            });
        }

        res.error = (err, statusCode = 500) => {
            let data = {};

            // if err is string
            if (typeof err === 'string') {
                data = {
                    errors: [{
                        message: err
                    }]
                } 
            }

            // if err is object
            if (typeof err === 'object') {
                if (!err.errors) {
                    let message = err.message;

                    err = JSON.parse(JSON.stringify(err));                

                    err.message = message;

                    data = { errors: [err] }
                } else {
                    data = err;
                }
            }
            
            res.status(statusCode).json({
                status: 'error',
                statusCode: statusCode,
                payload: data
            });
        }

        res.notfound = message => {
            res.status(404).json({
                status: 'error',
                statusCode: 404,
                payload: {
                    error: {
                        message: message
                    }
                }
            });
        }

        next();
    });    
}