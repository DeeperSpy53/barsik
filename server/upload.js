const multer = require("multer");
const moment = require("moment");

let fileName;

function getFileName() {
    return fileName;
}

const fileFilter = (req, file, cb) => {
    const types = ["text/plain", "text/csv", "text/html", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if(!types.includes(file.mimetype)){
        const err = new Error("Incorrect file");
        err.code = "INCORRECT_FILETYPE";

        return cb(err, false);
    }

    cb(null, true);
}

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'files/')
    },
    filename(req, file, cb){
        const date = moment().format("DDMMYYYY-HHmmss__SSS");
        cb(null, `${date}-${file.originalname}`);

        fileName =`${date}-${file.originalname}`;
    }
})

const upload = multer({
    // dest: './uploads',
    fileFilter,
    storage
})

module.exports = { upload, getFileName }