import multer from "multer";
import path from "path";
import fs from "fs";
import AppError from "../utils/AppError.js";

const uploadPath = "/tmp/uploads";

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadPath);
    },

    filename(req, file, cb) {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
});

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
    const allowedExtensions = [".xlsx", ".xls"];

    const extension = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
        return cb(new AppError("Only Excel files are allowed.", 400));
    }

    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

export default upload;

// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import AppError from "../utils/AppError.js";

// const uploadPath = "src/uploads";
// if(!fs.existsSync(uploadPath)){
//     fs.mkdirSync(uploadPath, {recursive: true});
// }

// const storage = multer.diskStorage({
//     destination(req, file, cb) {
//         cb(null, uploadPath);
//     },
//     filename(req, file, cb) {
//         cb(null, `${Date.now()}${path.extname(file.originalname)}`);
//     },
// });

// const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
//     const allowedExtensions = [".xlsx", ".xls"];
//     const extension = path.extname(file.originalname).toLowerCase();
//     if(!allowedExtensions.includes(extension)) {
//         return cb(new AppError("Only Excel files are allowed.", 400));
//     }
//     cb(null, true);
// };

// const upload = multer({
//     storage,
//     fileFilter,
//     limits: {
//         fileSize: 5 * 1024 * 1024
//     }
// });

// export default upload;