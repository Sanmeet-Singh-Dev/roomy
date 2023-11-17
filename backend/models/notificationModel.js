import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    recepientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    message:{
        type:String
    },
    isNotified:Boolean,
    timeStamp:{
        type:Date,
        default:Date.now
    }
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;