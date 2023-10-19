import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    recepientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    messageType:{
        type:String,
        enum:['text','image']
    },
    message:{
        type:String
    },
    imageUrl:String,
    timeStamp:{
        type:Date,
        default:Date.now
    }
});

const Message = mongoose.model('Message',messageSchema);

export default Message;