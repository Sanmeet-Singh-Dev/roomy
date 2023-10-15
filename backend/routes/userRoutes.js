import express from 'express';
const router = express.Router();
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
} from '..//controllers/userControllers.js';
import { updateUserProfile } from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.put('/profile', protect, updateUserProfile);
    // .route('/profile')
    // .get(protect, getUserProfile)
    // .put(protect, updateUserProfile);

export default router;