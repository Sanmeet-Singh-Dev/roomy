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
    getFriendRequests,
    sendFriendRequest,
    getUserFirends,
    sentFriendRequests,
    acceptRequest,
    recievedFriendRequests,
    blockUser,
    unfriendUser,
    unblockUser,
    getBlockedUsers,
    getUserNotifications,
    getUserByListMySpaceId,
    getUserById,
    getUserSpaces,
    deleteListing,
    declineRequest
} from '..//controllers/userControllers.js';

import { getMessages , setMessage , getUser , deleteMessage } from '../controllers/chatController.js';
import { 
    updateUserProfile,
    updateUserBio,
    updateUserHabits,
    updateUserInterests,
    updateUserTraits,
    updateUserRoomAttributes,
    saveRoomDetails
} from '../controllers/profileController.js';
import {
    // getUserPreferences,
    calculateCompatibilityWithAllUsers,
    getAllUsers,
} from '../controllers/compatibilityController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';
import { deleteMeeting, getMeetings, setMeeting, updateMeeting } from '../controllers/meetingController.js';
import { deleteNotification, getNotifications, setNotification } from '../controllers/notificationController.js';

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
router.get('/accepted-friends/:userId', protect, getAcceptedFriends);
router.get('/friends/:userId', protect, getUserFirends)
router.get('/friend-request/:userId', protect, getFriendRequests);
router.get('/notifications/:userId', protect, getUserNotifications);
router.post('/friend-request', protect, sendFriendRequest);
router.post('/block-user', protect, blockUser);
router.post('/unblock-user', protect, unblockUser);
router.post('/unfriend-user', protect, unfriendUser);
router.get('/friend-requests/sent/:userId', protect, sentFriendRequests);
router.get('/friend-requests/recieved/:userId', protect, recievedFriendRequests);
router.post('/friend-request/accept', protect, acceptRequest);
router.post('/friend-request/decline', protect, declineRequest);
router.get('/messages/:senderId/:recepientId', protect, getMessages);
router.get('/meetings/:senderId/:recepientId', protect, getMeetings);
router.post('/messages' , protect, upload.single('imageFile'),setMessage);
router.post('/meetings' , protect, setMeeting);
router.get('/user/:userId', protect, getUser);
router.post('/deleteMessages' , protect, deleteMessage);
router.post('/deleteMeetings', protect, deleteMeeting);
router.put('/updateMeetings', protect, updateMeeting);
router.put('/bio', protect, updateUserBio)
router.put('/habits', protect, updateUserHabits)
router.put('/interests', protect, updateUserInterests)
router.put('/traits', protect, updateUserTraits)
router.put('/update-room-attributes', protect, updateUserRoomAttributes)
router.post('/update-room-details', protect, saveRoomDetails)
router.get('/:id/preferences', protect, getUserPreferences)

router.post('/save-list-my-space', protect, saveListMySpaceData);
router.get('/list-spaces', protect, getAllListsMySpace);
router.post('/set-location', protect, setLocation);

router.get('/all', getAllUsers);

// router.get('/preferences', protect, getUserPreferences);
router.get('/compatibility', protect, calculateCompatibilityWithAllUsers);
router.get('/getBlockedUsers', protect, getBlockedUsers);
router.post('/request-notification' , protect, setNotification)
router.get('/notification/:recepientId' , protect, getNotifications);
router.post('/deleteNotification', protect, deleteNotification);
router.get('/getUserByListMySpace/:listMySpaceId', getUserByListMySpaceId);
router.get('/users/:userId', protect, getUserById);
router.get('/users/:userId/spaces', protect, getUserSpaces);
router.delete('/listings/:userId/:spaceId', protect, deleteListing);

export default router;