import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/");
    },
    filename: (req, file, cb) => {

        const userId = req.userId;

        const uniqueName =
            userId + "-" + file.originalname + "-" + Date.now();
        cb(
            null,
            uniqueName + path.extname(file.originalname)
        );
    },
});

// Multer instance
export const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
    }
});

export default upload;