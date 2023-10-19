import express from 'express';
const router = express.Router();
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    getAcceptedFriends,
} from '..//controllers/userControllers.js';

import { getMessages , setMessage , getUser , deleteMessage } from '../controllers/chatController.js';
import { updateUserProfile } from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';

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
router.post('/messages' , upload.single('imageFile'),setMessage);
router.get('/user/:userId', getUser);
router.post('/deleteMessages' , deleteMessage);

export default router;