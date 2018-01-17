'use strict';


module.exports = (rootpath, basepath) => {

    const path = require('path');

    class Connection {

        constructor (connectionData) {
            // props
            this.connection;
            this.connectionData = connectionData;
            this.models = {};
            this.relations = require(rootpath + '/' + basepath + '/models/relations.js');

            // methods
            this.getConnection = this.getConnection.bind(this);
            this.model = this.model.bind(this);
        }

        connect ({host, user, password, database, log}) {
            return new Sequelize(database, user, password, {
                host: host,
                dialect: 'mysql',
                logging: log || false,
                benchmark: false,
                pool: {
                    max: 5,
                    min: 0,
                    idle: 10000
                }
            });
        }

        getConnection () {
            if (!this.connection) {
                this.connection = this.connect(this.connectionData);
            }

            return this.connection;
        }

        model (modelName) {
            if (!this.models[modelName]) {
                let model = require(path.normalize(rootpath + '/' + basepath + '/models/' + modelName + '.js'))(this);

                this.models[modelName] = model;

                if (this.relations[modelName]) {
                    this.relations[modelName](model, this);
                }

                this.models[modelName] = model;
            }

            return this.models[modelName];
        }
    }
    return Connection;
}