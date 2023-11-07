import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Notification from '../models/notificationModel.js';


const setNotification = asyncHandler ( async (req, res) => {
   try {
        const { senderId, recepientId, message } = req.body;
        const sender = await User.findById(senderId);

        const updatedMessage = message.replace(/name/g, sender.name);

        const newNotification = new Notification({
            senderId,
            recepientId,
            message: updatedMessage,
            isNotified: false,
            timeStamp: new Date()
        });

        const recipientUser = await User.findById(recepientId);
        recipientUser.notifications.push(newNotification);
        
        await recipientUser.save();

        await newNotification.save();

        res.status(200).json({ message: "Notification sent successfully. " });
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

const getNotifications = asyncHandler (async (req, res) => {
    try {
        const { recepientId } = req.params;
        const notifications = await Notification.find({ recepientId:recepientId });
        res.json(notifications);
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

const deleteNotification = asyncHandler (async (req, res) => {
    try {
        const { id } = req.body;
        // console.log("notification id ", id);
        await Notification.deleteMany({ _id:id });

        res.json({ message: "Notification deleted successfully." })
    } catch (error) {
        console.log("Error ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export { setNotification , getNotifications , deleteNotification}