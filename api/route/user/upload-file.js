const multer = require("multer");
const path = require("path");
const app = stealth.app;

const fs = require("fs");
const destPath = path.join(__dirname, "../../../database/uploads/");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.mkdirSync(destPath, { recursive: true });
        cb(null, destPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }
});

app.post("/user-api/v1/upload-file", upload.single("file"), (req, res, next) => {
    if(req.file) {
        res.json({
            message: "File uploaded successfully",
            file: {
                filename: req.file.filename,
                url: `/user-api/v1/get-file/${req.file.filename}`,
                size: req.file.size
            }
        });
    } else {
        next(new Error("File upload failed"));
    }
});

app.use((err, req, res, next) => {
    if(err instanceof multer.MulterError) {
        return res.status(500).json({ error: err.message });
    } else if(err) {
        return res.status(500).json({ error: err.message });
    }

    next();
});