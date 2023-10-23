import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Meeting from '../models/meetingModel.js';

import { ObjectId } from 'mongodb';

const getMeetings = asyncHandler (async (req, res) => {
    try {
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


 // Endpoint to delete the meeting
const deleteMeeting = asyncHandler (async (req, res) => {
    try {

        const { meetings , date } = req.body;
        if (meetings.length === 0) {
            return res.status(400).json({ meeting: "Invalid request body" });
        }

        const meeting = await Meeting.findOne({ "creatTodo.todoList._id": meetings._id });

        if(meeting){
            await Meeting.deleteOne({ _id: meeting._id });
        res.status(200).json({ meeting: "Meeting deleted successfully." })
        }
        else {
            console.log("Error in Deletig meeting");
        }

    } catch (error) {
        console.log("Error ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

const updateMeeting = asyncHandler (async (req, res) => {
    try {

        const { meetings , date } = req.body;
        let meeting = await Meeting.findOne({ "creatTodo.todoList._id": meetings._id});

        if(meeting){
            meeting.creatTodo.todoList[0] = meetings;
        const stringId = meeting.creatTodo.todoList[0]._id;
        const objectId = new ObjectId(stringId);
        meeting.creatTodo.todoList[0]._id = objectId;  

        await meeting.save();

        res.status(200).json({meeting:"Meeting updated Successfully."});
        }
        else{
            res.status(404).json({ meeting: "Meeting not updated" });
        }
    } catch (error) {
        console.log("Error ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

 export { setMeeting , getMeetings , deleteMeeting, updateMeeting}
 