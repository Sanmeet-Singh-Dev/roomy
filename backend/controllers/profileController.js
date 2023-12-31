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
      userProfile.gender = req.body.gender || User.gender;
      userProfile.dateOfBirth = req.body.dateOfBirth || User.dateOfBirth;
      userProfile.budget = req.body.budget || User.budget;
  
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
  const { work, bio, profilePhoto,image } = req.body.data;
  console.log(req.body);
  // Find the user's profile by their user ID
  const userProfile = await User.findOne({ _id: req.user._id.toString() });

  if (userProfile) {
    // Update user profile fields
    userProfile.work = work || userProfile.work;
    userProfile.bio = bio || userProfile.bio;
    userProfile.profilePhoto = profilePhoto || userProfile.profilePhoto;
    userProfile.image = image || userProfile.image;

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

// controllers/userController.js
const updateUserRoomAttributes = async (req, res) => {
  console.log(req.user._id);

  const { attributes, numBedrooms, numBathrooms } = req.body;

  try {
    // Find the user by their user ID
    const user = await User.findOne({ _id: req.user._id.toString() });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the listMySpace object fields
    if (user.listMySpace) {
      if (attributes) {
        user.listMySpace.attributes = attributes;
      }

      if (numBedrooms) {
        user.listMySpace.numOfBedrooms = numBedrooms;
      }

      if (numBathrooms) {
        user.listMySpace.numOfBathroom = numBathrooms;
      }

      // Save the updated user document
      const updatedUser = await user.save();
      return res.status(200).json(updatedUser);
    } else {
      return res.status(404).json({ message: 'User does not have a listMySpace object' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Save room details
const saveRoomDetails = async (req, res) => {
  const { availability,
    roomSuitability,
    petFriendly,
    furnished,
  budget } = req.body;

  try {
    const user = await User.findOne({ _id: req.user._id.toString() });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user's listMySpace field with room details
    user.listMySpace.availability = availability;

    user.listMySpace.roomSuitability = roomSuitability;

    user.listMySpace.petFriendly = petFriendly;

    user.listMySpace.furnished = furnished;

    user.listMySpace.budget = budget;

    // Save the user with updated room details
    const updatedUser = await user.save();

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to save room details' });
  }
};





export {
  updateUserProfile,
  updateUserBio,
  updateUserHabits,
  updateUserInterests,
  updateUserTraits,
  updateUserRoomAttributes,
  saveRoomDetails
};
  