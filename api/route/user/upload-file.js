const multer = require("multer");
const path = require("path");
const app = stealth.app;

const fs = require("fs");
const destPath = path.join(__dirname, "../../../database/uploads/");
const { User, querySearch } = require("../../../components/User.js");
const { Message } = require("../../../components/Message.js");
const { getConversationId } = require("../../../components/Conversation.js");
const sendStatusIf = require("../../../utils/resStatus.js");

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
            // Initialize sender user with token
            const user = new User();
            await user.initWithToken(req.cookies.token);
            // Search for recipient by ID
            const recipientProperties = await querySearch(recipientId, "id");
            if (sendStatusIf(res, !recipientProperties, 404, "Recipient not found")) return;
            const recipientUser = new User();
            await recipientUser.initWithToken(recipientProperties.token);
            // Create a new message object
            const message = new Message({
                senderId: user.id,
                recipientId: recipientUser.id,
                attachments: [fileData],
                conversationId: getConversationId(user.id, recipientUser.id)
            });
            
            // Check if messages should be saved based on socket header
            const socket = user.getSocket();
            if (socket && req.headers['save-attachments'] === "true") {
                await message.save();
            } else {
                // Delete the file from the temporary storage
                setTimeout(() => {
                    fs.unlinkSync(path.join(destPath, req.file.filename));
                }, 1000);
            }

            // Send new message notification to recipient
            recipientUser.send("newMessage", {
                author: { id: user.id, username: user.username, pfpURL: user.pfpURL },
                attachments: [fileData],
                creationTime: message.creationTime
            });
        } catch (error) {
            console.error("Error sending socket message:", error);
        }

        // Respond with success message and file data
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