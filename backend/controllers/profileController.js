import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const userProfile = await User.findOne({ _id: req.user._id.toString() });
  
    if (userProfile) {
      // Update user profile fields
      userProfile.fullName = req.body.fullName || User.fullName;
      userProfile.gender = req.body.gender || User.gender;
      userProfile.dateOfBirth = req.body.dateOfBirth || User.dateOfBirth;
  
      const updatedUserProfile = await userProfile.save();
  
      res.status(200).json(updatedUserProfile);
    } else {
      res.status(404);
      throw new Error('User profile not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/bio
// @access  Private
const updateUserBio = asyncHandler(async (req, res) => {
  const { work, bio } = req.body;
  // Find the user's profile by their user ID
  const userProfile = await User.findOne({ _id: req.user._id.toString() });

  if (userProfile) {
    // Update user profile fields
    userProfile.work = work || userProfile.work;
    userProfile.bio = bio || userProfile.bio;

    const updatedUserProfile = await userProfile.save();
  
    res.status(200).json(updatedUserProfile);
  } else {
    res.status(404);
    throw new Error('User profile not found');
  }
});

// @desc    Update user Habits
// @route   PUT /api/users/habits
// @access  Private
const updateUserHabits = asyncHandler(async (req, res) => {
  const { smoking, guests, drinking, pets, food } = req.body;
  // console.log(req.body);
  // Find the user's profile by their user ID
  const userProfile = await User.findOne({ _id: req.user._id.toString() });

  // console.log(userProfile);

  if (userProfile) {
    // Update user profile fields
    userProfile.smoking = smoking || userProfile.smoking;
    userProfile.guests = guests || userProfile.guests;
    userProfile.drinking = drinking || userProfile.drinking;
    userProfile.pets = pets || userProfile.pets;
    userProfile.food = food || userProfile.food;
    
    const updatedUserProfile = await userProfile.save();
  
    res.status(200).json(updatedUserProfile);
  } else {
    res.status(404);
    throw new Error('User profile not found');
  }
});

// @desc    Update user interests
// @route   PUT /api/users/interests
// @access  Private
const updateUserInterests = asyncHandler(async (req, res) => {
  const { interests } = req.body;

  // Find the user's profile by their user ID
  const userProfile = await User.findOne({ _id: req.user._id.toString() });

  if (userProfile) {
    // Update user interests field
    userProfile.interests = interests || userProfile.interests;

    const updatedUserProfile = await userProfile.save();

    res.status(200).json(updatedUserProfile);
  } else {
    res.status(404);
    throw new Error('User profile not found');
  }
});

// @desc    Update user traits
// @route   PUT /api/users/traits
// @access  Private
const updateUserTraits = asyncHandler(async (req, res) => {
  const { traits } = req.body;

  console.log(traits);
  console.log(req.user._id);

  // Find the user's profile by their user ID
  const userProfile = await User.findOne({ _id: req.user._id.toString() });

  if (userProfile) {
    // Update user traits field
    userProfile.traits = traits || userProfile.traits;

    const updatedUserProfile = await userProfile.save();

    res.status(200).json(updatedUserProfile);
  } else {
    res.status(404);
    throw new Error('User profile not found');
  }
});


export {
  updateUserProfile,
  updateUserBio,
  updateUserHabits,
  updateUserInterests,
  updateUserTraits,
};
  