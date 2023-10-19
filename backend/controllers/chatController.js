import asyncHandler from 'express-async-handler';
import Message from '../models/messageModel.js';
import User from '../models/userModel.js';
import multer from 'multer';

const getMessages = asyncHandler (async (req, res) => {
    try {
        console.log("Inside get message");
        const { senderId, recepientId } = req.params;
        const messages = await Message.find({
            $or: [
                { senderId: senderId, recepientId: recepientId },
                { senderId: recepientId, recepientId: senderId }
            ]
        }).populate("senderId", "_id name");

        res.json(messages);
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Configure multer for handling file uploads 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files/');  //Specify the desired destination folder
    },
    filename: function (req, file, cb) {
        // Generate a unique filename for the uploaded file
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

// Endpoint to post messages and store it in backend
const setMessage = asyncHandler ( async (req, res) => {
   try {
    console.log("Inside set message");
        const { senderId, recepientId, messageType, messageText } = req.body;

        console.log("req",req);

        console.log("Sender id",senderId)
        console.log("Reciever id",recepientId)
        console.log("Message type",messageType)
        console.log("message text",messageText)

        const newMessage = new Message({
            senderId,
            recepientId,
            messageType,
            message: messageText,
            timeStamp: new Date(),
            imageUrl: messageType === "image" ? req.file.path : null
        });

        await newMessage.save();
        res.status(200).json({ message: "Message sent successfully. " });
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal server error." });
    }
});


// Endpoint to get the User details to design the chat room header
const getUser = asyncHandler (async (req, res) => {
    try {

        console.log("Inside get User");
        const { userId } = req.params;
        const recepientId = await User.findById(userId);
        res.json(recepientId);
    }
    catch (error) {
        console.log("Error ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Endpoint to delete the messages
const deleteMessage = asyncHandler (async (req, res) => {
    try {

        console.log("Inside delete message");
        const { messages } = req.body;

        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ message: "Invalid request body" });
        }

        await Message.deleteMany({ _id: { $in: messages } });

        res.json({ message: "Messages deleted successfully." })
    } catch (error) {
        console.log("Error ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



export { getMessages , setMessage , getUser , deleteMessage }