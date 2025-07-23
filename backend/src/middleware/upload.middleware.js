import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if(file.mimetype.startWith("image/")){
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
}

const upload = multer({
    storage: storage, 
    fileFilter: fileFilter,
    limits: {FileSize: 5* 1024 * 1024}
});

export default upload;
