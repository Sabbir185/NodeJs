const multer = require("multer");
const path = require("path");
const createError = require('http-errors');

function uploader(subFolder_name, file_types, file_max_size, error_msg) {
    // file upload folder
    const UPLOADS_FOLDER = path.join(__dirname, `../public/uploads/${subFolder_name}/`);

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, UPLOADS_FOLDER);
        },
        filename: (req, file, cb) => {
            const fileExt = path.extname(file.originalname);
            const fileName = file.originalname
                .replace(fileExt, '')
                .toLowerCase()
                .split(' ')
                .join('-') + '-' + Date.now();
            cb(null, fileName + fileExt);
        }
    })

    // final multer file upload object
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: file_max_size,
        },
        fileFilter: (req, file, cb) => {
            if (file_types.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(createError(error_msg));
            }
        }
    })

    return upload;
}


module.exports = uploader;