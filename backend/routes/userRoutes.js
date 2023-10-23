import express from 'express';
const router = express.Router();
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    getAcceptedFriends,
    getUserPreferences,
    saveListMySpaceData,
    getAllListsMySpace,
    setLocation,
} from '..//controllers/userControllers.js';

import { getMessages , setMessage , getUser , deleteMessage } from '../controllers/chatController.js';
import { 
    updateUserProfile,
    updateUserBio,
    updateUserHabits,
    updateUserInterests,
    updateUserTraits,
} from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';
import { deleteMeeting, getMeetings, setMeeting, updateMeeting } from '../controllers/meetingController.js';

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

router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.put('/profile', protect, updateUserProfile);
router.get('/accepted-friends/:userId', getAcceptedFriends);
router.get('/messages/:senderId/:recepientId', getMessages);
router.get('/meetings/:senderId/:recepientId', getMeetings);
router.post('/messages' , upload.single('imageFile'),setMessage);
router.post('/meetings' , setMeeting);
router.get('/user/:userId', getUser);
router.post('/deleteMessages' , deleteMessage);
router.post('/deleteMeetings', deleteMeeting);
router.put('/updateMeetings', updateMeeting);
router.put('/bio', protect, updateUserBio)
router.put('/habits', protect, updateUserHabits)
router.put('/interests', protect, updateUserInterests)
router.put('/traits', protect, updateUserTraits)
router.get('/:id/preferences', protect, getUserPreferences)

router.post('/save-list-my-space', saveListMySpaceData);
router.get('/list-spaces', getAllListsMySpace);
router.post('/set-location', protect, setLocation);
// router.put('/interests', protect, updateUserInterests)
// router.put('/traits', protect, updateUserTraits)
// router.get('/:id/preferences', protect, getUserPreferences)

export default router;