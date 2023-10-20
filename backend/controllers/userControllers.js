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

//@desc    Update user profile
// route    POST /api/users/save-list-my-space
// @access  Private

// Controller function to save listMySpace data
const saveListMySpaceData = asyncHandler(async (req, res) => {
    const { userId, data } = req.body; // Assuming data is an object with title, description, budget, and image URLs
  
    try {
      // Find the user document and update the 'listMySpace' field with the new data
      const user = await User.findById(userId);
      if (user) {
        user.listMySpace = data;
        await user.save();
        res.status(201).json({ message: 'ListMySpace data saved successfully' });
      } else {
        res.status(404);
        throw new Error('User not found');
      }
    } catch (error) {
      res.status(500);
      throw new Error('Error saving ListMySpace data: ' + error.message);
    }
  });

//   const getAllListsMySpace = asyncHandler(async (req, res) => {
//     try {
//       // Find all users in the database
//       const users = await User.find();
  
//       // Filter users who have a non-empty listMySpace object
//       const usersWithListMySpace = users.filter((user) => user.listMySpace && Object.keys(user.listMySpace).length > 1);
//         console.log(usersWithListMySpace)
//       // Extract and combine listMySpace data from filtered users
//       const allListsMySpace = usersWithListMySpace.map((user) => user.listMySpace);
  
//       res.json(allListsMySpace);
//     } catch (error) {
//       console.error('Error fetching all listMySpace data:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });

// const getAllListsMySpace = asyncHandler(async (req, res) => {
//     try {
//       // Find all users in the database
//       const users = await User.find();
  
//       // Log the listMySpace field for each user
//       users.forEach((user) => {
//         console.log('User ID:', user._id);
//         console.log('listMySpace:', user.listMySpace);
//       });
  
//       // Filter users who have a non-empty listMySpace object
//       const usersWithListMySpace = users.filter((user) => user.listMySpace && Object.keys(user.listMySpace).length > 0);
  
//       // Extract and combine listMySpace data from filtered users
//       const allListsMySpace = usersWithListMySpace.map((user) => user.listMySpace);
  
//       res.json(allListsMySpace);
//     } catch (error) {
//       console.error('Error fetching all listMySpace data:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });

const getAllListsMySpace = asyncHandler(async (req, res) => {
    try {
      // Find all users in the database
      const users = await User.find();
  
      // Filter users who have a non-empty listMySpace object
      const usersWithListMySpace = users.filter((user) => {
        const { listMySpace } = user;
        return listMySpace && listMySpace.title && listMySpace.description && listMySpace.budget;
      });
  
      // Extract and combine listMySpace data from filtered users
      const allListsMySpace = usersWithListMySpace.map((user) => user.listMySpace);
  
      res.json(allListsMySpace);
    } catch (error) {
      console.error('Error fetching all listMySpace data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
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

const getAcceptedFriends = asyncHandler (async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate("friends", "name email image")

        const acceptedFriends = user.friends;
        res.json(acceptedFriends);
    }
    catch (error) {
        console.log("Error", error);
        res.status(500).json({ message: "Internal server error." })
    }
});

const setLocation = asyncHandler(async (req, res) => {
    const { userId, location } = req.body;
    console.log(userId)
    console.log(req.body)
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        res.status(404);
        throw new Error('User not found');
      }

      user.location = {
        type: 'Point',
        coordinates: [location.coordinates[1], location.coordinates[0]],
      };

  
      await user.save();
  
      res.status(200).json({ message: 'Location set successfully' });
    } catch (error) {
      console.error('Error setting location:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    getAcceptedFriends,
    saveListMySpaceData,
    getAllListsMySpace,
    setLocation
};