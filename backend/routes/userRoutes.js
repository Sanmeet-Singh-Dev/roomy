import express from 'express';
const router = express.Router();
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    getUserPreferences,
} from '..//controllers/userControllers.js';
import { 
    updateUserProfile,
    updateUserBio,
    updateUserHabits,
    updateUserInterests,
    updateUserTraits,
} from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.put('/profile', protect, updateUserProfile);
    // .route('/profile')
    // .get(protect, getUserProfile)
    // .put(protect, updateUserProfile);
router.put('/bio', protect, updateUserBio)
router.put('/habits', protect, updateUserHabits)
router.put('/interests', protect, updateUserInterests)
router.put('/traits', protect, updateUserTraits)
router.get('/:id/preferences', protect, getUserPreferences)

export default router;