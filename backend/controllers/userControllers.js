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

// Endpoint to send a request to a User
const sendFriendRequest = asyncHandler (async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;

  try {
      //Update recievers friendRequest array
      await User.findByIdAndUpdate(selectedUserId, {
          $push: { friendRequests: currentUserId }
      });

      //Update senders sentfriendrequest array
      await User.findByIdAndUpdate(currentUserId, {
          $push: { sentFriendRequests: selectedUserId }
      });

      res.sendStatus(200);
  }
  catch (error) {
      res.status(500);
  }
});


// Endpoint to show all the friend request of a particular user
const getFriendRequests = asyncHandler (async (req, res) => {

  try {
      const { userId } = req.params;

      const user = await User.findById(userId).populate("friendRequests", "name email image").lean();
      const friendRequests = user.friendRequests;
      res.json(friendRequests);
  }
  catch (error) {
      console.log("Error", error);
      res.status(500).json({ message: "Internal Server error." })
  }
});

const getUserFirends = asyncHandler (async (req, res) => {
  try {
      const { userId } = req.params;
      User.findById(userId).populate("friends").then((user) => {
          if(!user){
              return res.status(404).json({message:"User not found"});
          }

          const friendIds = user.friends.map((friend) => friend._id);
          res.status(200).json(friendIds);
      })
  } catch (error) {
      console.log("Error ", error);
      res.status(500).json({ error: "Internal server error" });
  }
});

const sentFriendRequests = asyncHandler (async (req, res) => {
  try {
      const { userId } = req.params;
      const user = await User.findById(userId).populate("sentFriendRequests", "name email image").lean();

      const sentFriendRequests = user.sentFriendRequests;
      res.json(sentFriendRequests);
  } catch (error) {
      console.log("Error ", error);
      res.status(500).json({ error: "Internal server error" });
  }
});

const recievedFriendRequests = asyncHandler (async (req, res) => {
  try {
      const { userId } = req.params;
      const user = await User.findById(userId).populate("friendRequests", "name email image").lean();

      const recievedFriendRequests = user.friendRequests;
      res.json(recievedFriendRequests);
  } catch (error) {
      console.log("Error ", error);
      res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to accept a request of a particular person
const acceptRequest = asyncHandler (async (req, res) => {

  try {
      const { senderId, recepientId } = req.body;

      // Retrieve the document of Sender and Recepient
      const sender = await User.findById(senderId);
      const recepient = await User.findById(recepientId);

      sender.friends.push(recepientId);
      recepient.friends.push(senderId);

      recepient.friendRequests = recepient.friendRequests.filter((request) => request.toString() !== senderId.toString());
      sender.sentFriendRequests = sender.sentFriendRequests.filter((request) => request.toString() !== recepientId.toString());

      await sender.save();
      await recepient.save();

      res.status(200).json({ message: "Friend Request accepted successfully." })
  }
  catch (error) {
      console.log("Error", error);
      res.status(500).json({ message: "Internal server error." })
  }
});


// Endpoint to Block a User
const blockUser = asyncHandler (async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;

  try {
    
      await User.findByIdAndUpdate(currentUserId, {
          $push: { blockedUser: selectedUserId }
        });

        await User.findByIdAndUpdate(selectedUserId, {
          $push: { blockedUser: currentUserId }
        });

      await User.findByIdAndUpdate(currentUserId, {
        $pull: { friendRequests: selectedUserId }
      });

      await User.findByIdAndUpdate(currentUserId, {
        $pull: { sentFriendRequests: selectedUserId }
      });

      await User.findByIdAndUpdate(currentUserId, {
       $pull: { friends: selectedUserId }
      });

      await User.findByIdAndUpdate(selectedUserId, {
        $pull: { friends: currentUserId }
      });

      await User.findByIdAndUpdate(selectedUserId, {
        $pull: { friendRequests: currentUserId }
      });

      await User.findByIdAndUpdate(selectedUserId, {
        $pull: { sentFriendRequests: currentUserId }
      });

      User.findById(currentUserId).populate("friends").then((user) => {
        if(!user){
              return res.status(404).json({message:"User not found"});
        }
          const friendIds = user.friends.map((friend) => friend._id);
          res.status(200).json(friendIds);
        })
    }
  catch (error) {
      res.status(500);
  }
});

const setLocation = asyncHandler(async (req, res) => {
  const { location } = req.body;
  const user = await User.findOne({ _id: req.user._id.toString() });

    // console.log(userId)
    // console.log(req.body)
  
    try {
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
    getUserPreferences,
    getAcceptedFriends,
    saveListMySpaceData,
    getAllListsMySpace,
    setLocation,
    getFriendRequests,
    sendFriendRequest,
    getUserFirends,
    sentFriendRequests,
    acceptRequest,
    recievedFriendRequests,
    blockUser
};