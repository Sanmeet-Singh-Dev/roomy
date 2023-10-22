import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Meeting from '../models/meetingModel.js';

const getMeetings = asyncHandler (async (req, res) => {
    try {
        // console.log("Inside get meetings");
        const { senderId, recepientId } = req.params;
        const meetings = await Meeting.find({
            $or: [
                { senderId: senderId, recepientId: recepientId },
                { senderId: recepientId, recepientId: senderId }
            ]
        }).populate("senderId", "_id name");

        res.json(meetings);
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

const setMeeting = asyncHandler ( async (req, res) => {
    try {
     console.log("Inside set meeting");
         const { senderId, recepientId, creatTodo } = req.body;
 
         const newMeeting = new Meeting({
             senderId,
             recepientId,
             creatTodo: creatTodo
         });
 
         await newMeeting.save();
         res.status(200).json({ meeting: "Meeting saved successfully. " });
     }
     catch (error) {
         console.log("error", error);
         res.status(500).json({ meeting: "Internal server error." });
     }
 });

 export { setMeeting , getMeetings }
 