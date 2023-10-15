import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  console.log("Here in pro");
  console.log("Requested user:", req.user._id.toString())
    // const userProfile = await UserProfile.findOne({ user: req.user._id.toString() });
    const user = req.user;

    

    console.log('Received a profile update request:', req.body);
    // console.log('Received a profile update request profile:', userProfile);
  
    if (user) {
      // Update user profile fields
      user.fullName = req.body.fullName || user.fullName;
      user.gender = req.body.gender || user.gender;
      user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
  
      const updatedUserProfile = await user.save();
  
      res.status(200).json(updatedUserProfile);
    } else {
      res.status(404);
      throw new Error('User profile not found');
    }
});

export { updateUserProfile };
  