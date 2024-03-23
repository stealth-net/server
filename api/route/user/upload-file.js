const multer = require("multer");
const path = require("path");
const app = stealth.app;

const fs = require("fs");
const destPath = path.join(__dirname, "../../../database/uploads/");
const { User, query_search } = require("../../../components/User.js");
const { Message } = require("../../../components/Message.js");
const { get_conversation_id } = require("../../../components/Conversation.js");

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

app.post("/user-api/v1/upload-file", upload.single("file"), async (req, res, next) => {
    if(req.file) {
        const recipientId = req.body.recipientId;
        const fileData = {
            filename: req.file.filename,
            url: `/user-api/v1/get-file/${req.file.filename}`,
            size: req.file.size
        };

        try {
            const user = new User();
            await user.initWithToken(req.cookies.token);
            const recipientProperties = await query_search(recipientId, "id");
            if (!recipientProperties) {
                throw new Error("Recipient not found");
            }
            const recipientUser = new User();
            await recipientUser.initWithToken(recipientProperties.token);
            const message = new Message({
                senderId: user.id,
                recipientId: recipientUser.id,
                attachments: [fileData],
                conversationId: get_conversation_id(user.id, recipientUser.id)
            });
            await message.save();
            recipientUser.send("newMessage", {
                author: { id: user.id, username: user.username, pfpURL: user.pfpURL },
                attachments: [fileData],
                creationTime: message.creationTime
            });
        } catch (error) {
            console.error("Error sending socket message:", error);
        }

        res.json({
            message: "File uploaded successfully",
            file: fileData
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