import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

// @desc    Register a new user
// route    POST /api/users
// @access  Public
const registerUser = asyncHandler (async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({email});

    if(userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({    
        name,
        email,
        password,
    });
    
    if(user) {
        const token = generateToken(user._id.toString());
        res.status(201).json({
            _id: user._id,
            name: user.name, 
            email: user.email,
            token: token
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Auth user/ set token
// route    POST /api/users/auth
// @access  Public
const authUser = asyncHandler (async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({email});

    if(user && await user.matchPassword(password)) {
        const token = generateToken(user._id.toString());
        res.status(201).json({
            _id: user._id,
            name: user.name, 
            email: user.email,
            token: token
        });
    } else {
        console.error('Login failed: Invalid email or password');
        res.status(400);
        throw new Error('Invalid email or password');
    }
});

// @desc    Logout user
// route    POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler (async (req, res) => {
res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
})

    res.status(200).json({message: 'User logged out'})
});

// @desc    Get user profile
// route    GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler (async (req, res) => {
    const user = {
        _id: req.user._id,
        name: req.user.name, 
        email: req.user.email
    };

    res.status(200).json(user)
});

const getUserPreferences = asyncHandler(async (req, res) => {
    const userId = req.params.id;
  
    // Fetch the user's preferences based on their ID
    const user = await User.findOne({ _id: req.user._id.toString() });
  
    if (user) {
      // Return the user's preferences
      res.status(200).json({
        preferences: {
          smoking: user.smoking,
          guests: user.guests,
          drinking: user.drinking,
          pets: user.pets,
          food: user.food,
          interests: user.interests,
          traits: user.traits,
          // Add more preferences here
        },
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
});
  

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    getUserPreferences,
};