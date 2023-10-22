import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    recepientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    creatTodo: {
        date: String,
        key: String,
        markedDot: {
            date: String,
            dots: [{
                color: String,
                key: String,
                selectedDotColor: String
            }]
        },
        todoList: [{
            alarm: {
                createEventAsyncRes: String,
                isOn: Boolean,
                time: Date
            },
            color: String,
            key: String,
            notes: String,
            title: String
        }]
    }
});

const Meeting = mongoose.model('Meeting',meetingSchema);

export default Meeting;