// dependencies
const fs = require('fs');
const path = require('path');

// module scaffolding
const lib = {};

// base directory
lib.basedir = path.join(__dirname, '../.data/');

// create, writing to the file
lib.create = (dir, file, data, callback) => {
    // open file first, wx is a file system flag
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err1, fileDescriptor) => {
        if (!err1 && fileDescriptor) {
            const stringData = JSON.stringify(data);
            fs.writeFile(fileDescriptor, stringData, (err2) => {
                if (!err2) {
                    fs.close(fileDescriptor, (err3) => {
                        if (!err3) {
                            callback(false)
                        } else {
                            callback('Error closing file!')
                        }
                    })
                } else {
                    callback('Error writing file!')
                }
            })
        } else {
            callback('Error opening file!')
        }
    })
}

// read file
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
        if (!err) {
            callback(err, data);
        } else {
            callback('Error reading file!');
        }
    })
}

// file update
lib.update = (dir, file, data, callback) => {
    // file open, r+ flag is used
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err1, fileDescriptor) => {
        if (!err1 && fileDescriptor) {
            const stringData = JSON.stringify(data);
            // first truncate file
            fs.ftruncate(fileDescriptor, (err2) => {
                if (!err2) {
                    fs.writeFile(fileDescriptor, stringData, (err3) => {
                        if (!err3) {
                            fs.close(fileDescriptor, (err4) => {
                                if (!err4) {
                                    callback(false);
                                } else {
                                    callback('Error closing file!');
                                }
                            })
                        } else {
                            callback('Error writing to file!');
                        }
                    })
                } else {
                    callback('Error truncating file!');
                }
            })
        } else {
            callback('Error opening file!');
        }
    })
}

// file delete
lib.delete = (dir, file, callback) => {
    // fs unlink
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
        if (!err) {
            callback(false)
        } else {
            callback('Error deleting file!')
        }
    })
}

// export module
module.exports = lib;