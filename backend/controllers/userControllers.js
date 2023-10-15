import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';
import UserProfile from '../models/userProfileModel.js';

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
        const token = generateToken(user._id);
        console.log('User created successfully:', token);
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
    console.log('here');
    const { email, password } = req.body;
    console.log(req.body);

    console.log('Received a login request:', { email, password });

    const user = await User.findOne({email});
    
    if(user && await user.matchPassword(password)) {
        console.log('User logged in successfully:', user._id.toString());
        const token = generateToken(req,user._id.toString());
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

// @desc    Update user profile
// route    PUT /api/users/profile
// @access  Private
// const updateUserProfile = asyncHandler (async (req, res) => {
//     const user = await User.findById(req.user._id);

//     if(user) {
//         user.name = req.body.name || user.name;
//         user.email = req.body.email || user.email;

//         if(req.body.password) {
//             user.password = req.body.password;
//         }
//         const updatedUser = await user.save();

//         res.status(201).json({
//             _id: updatedUser._id,
//             name: updatedUser.name, 
//             email: updatedUser.email
//         });
//     } else {
//         res.status(404);
//         throw new Error('User not found');
//     }       

//     res.status(200).json({message: 'Update user profile'})
// });

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
// const updateUserProfile = asyncHandler(async (req, res) => {
//     console.log("Here")
//     console.log(req)
//       const userProfile = await UserProfile.findOne({ user: req.body._id });
  
      
  
//       console.log('Received a profile update request:', req.body);
//       console.log('Received a profile update request profile:', userProfile);
    
//       if (userProfile) {
//         // Update user profile fields
//         userProfile.fullName = req.body.fullName || userProfile.fullName;
//         userProfile.gender = req.body.gender || userProfile.gender;
//         userProfile.dateOfBirth = req.body.dateOfBirth || userProfile.dateOfBirth;
    
//         const updatedUserProfile = await userProfile.save();
    
//         res.status(200).json(updatedUserProfile);
//       } else {
//         res.status(404);
//         throw new Error('User profile not found');
//       }
// });

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
};