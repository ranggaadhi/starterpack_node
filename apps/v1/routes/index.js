'use strict';

module.exports = (app, router) => {
    const MainController = app.controller('main');
    router.get('/', MainController.index);
    // router.use('/', app.route('coa-default'));////

};