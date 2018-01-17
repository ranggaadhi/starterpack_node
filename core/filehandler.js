'use strict';

const path = require('path');
const multer = require('multer');
const fs = require('fs-extra');

class FileHandler {
    constructor (basepath, dest, configs) {
        // deconstruct configs
        let {storage, allowedExtensions, maxFileSize, filename} = configs;

        // props
        this.basepath = basepath;
        this.dest = dest;
        this.storage = storage || 'disk';
        this.allowedExtensions = allowedExtensions;
        this.maxFileSize = maxFileSize;
        this.filename = filename;

        // methods
        this.getFilters = this.getFilters.bind(this);
        this.getStorage = this.getStorage.bind(this);
        this.getDiskStorage = this.getDiskStorage.bind(this);
        this.handle = this.handle.bind(this);
    }

    // file filters
    getFilters () {
        // get allowed file extensions
        let allowedExtensions = this.allowedExtensions;

        return function (req, file, callback) {
            if (allowedExtensions) {
                let allowExts;
                let varType = typeof allowedExtensions;

                if (varType === 'string' && allowedExtensions.length > 0) {
                    allowExts = allowedExtensions.split(',').map((ext) => ext.trim());
                } else if (varType === 'object') {
                    allowExts = allowedExtensions;
                } else if (varType === 'function') {
                    allowExts = allowedExtensions(req, file);
                }

                if (allowExts && allowExts.indexOf(path.extname(file.originalname)) < 0) {
                    return callback(new Error('File type is not allowed!'));
                }
            }

            return callback(null, true);
        }
    }

    // get storage type
    getStorage (req) {
        switch (this.storage) {
        case 'disk':
        default:
            return this.getDiskStorage(req);
        }
    }

    // store file on disk
    getDiskStorage (req) {
        let targetDir;
        let getDest = this.dest || '/';
        let varType = typeof getDest;

        if (varType === 'string') {
            targetDir = getDest;
        } else if (varType === 'function') {
            targetDir = getDest(req);
        } else {
            throw new Error('Target is not specified!');
        }

        // target directory is relative to upload base directory
        let dirpath = path.normalize(this.basepath + '/' + targetDir);

        // make sure the directory exist, create if not exist
        fs.ensureDirSync(dirpath);

        let getFilename = this.filename;

        return multer.diskStorage({
            destination: (req, file, callback) => {
                file.basepath = targetDir;

                callback(null, dirpath);
            },
            filename: (req, file, callback) => {
                let ext = path.extname(file.originalname);
                let filename = file.fieldname + '_' + Date.now() + ext;
                let varType = typeof getFilename;

                if (varType === 'string' && getFilename.length > 0) {
                    filename = getFilename;
                } else if (varType === 'function') {
                    filename = getFilename(req, file) + ext;
                }

                callback(null, filename);
            }
        })
    }

    handle (req, res, next) {
        const upload = multer({
            storage: this.getStorage(req),
            fileFilter: this.getFilters(),
            limits: {
                fileSize: this.maxFileSize || 2048000
            }
        });

        return upload.any()(req, res, next);
    }
}

module.exports = (rootpath) => (dest, configs = {}) => {
    const fh = new FileHandler(rootpath, dest, configs);

    return fh.handle;
}