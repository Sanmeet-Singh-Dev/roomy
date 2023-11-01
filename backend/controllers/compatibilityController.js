import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

// Function to retrieve all users from the database
const getAllUsers = async () => {
    try {
      const users = await User.find(); // Retrieve all user records
      
      return users;
    } catch (error) {
      console.error('Error retrieving users:', error);
      throw error;
    }
};

// Function to calculate the compatibility score between two users
const calculateCompatibilityScore = async (currentUser, user) => {
    // Fetch preferences for both users based on their IDs


    let currentUserOptions = 6; 
    let userOptions = 6;

    currentUserOptions += currentUser.interests.length;
    currentUserOptions += currentUser.traits.length;

    userOptions += user.interests.length;
    userOptions += user.traits.length;
    // let score = 0.64*6;

    // score += currentUser.interests.length*0.64;
    // score += currentUser.traits.length*0.64;

    // Calculate compatibility score based on preferences (use your algorithm)
    const compatibilityScore = calculateCompatibility(currentUser, user);

    let totalOptions = 0;
    // let finalPercentage = 0;
    const finalPercentage = compatibilityScore;

    if( currentUserOptions >= userOptions ){
      totalOptions = currentUserOptions;
    } else 
        totalOptions = userOptions;

    if(compatibilityScore !== 0 ){
      finalPercentage = compatibilityScore*(100/totalOptions);
    }

    return finalPercentage.toFixed(0);
};
  
// Calculate compatibility scores with all users
const calculateCompatibilityWithAllUsers = async (req, res) => {

    try{
    
        const userId = req.user._id.toString();

        const compatibilityScores = [];
        let users = await getAllUsers();

        const currentUser = await User.findOne({ _id: userId });

        for (const blockedUserId of currentUser.blockedUser) {
          users = users.filter(user => user._id.toString() !== blockedUserId.toString());
        }
    
        for (const user of users) {
            if (user._id.toString() !== userId) {
            // Exclude the current user from compatibility calculations
            const compatibilityScore = await calculateCompatibilityScore(currentUser, user);



            // Create an object to represent the user and their compatibility score
                const compatibilityData = {
                    user: user,
                    score: compatibilityScore.toFixed(0),
                };

                // Add the compatibility data to the array
                compatibilityScores.push(compatibilityData);

            }
        }   

        res.status(200).json(compatibilityScores);
        

    } catch (error) {
        console.error('Error calculating compatibility scores:', error);
        throw error;
    }

};
  
// Function to calculate the compatibility score based on preferences
const calculateCompatibility = (currentUser, user) => {

    const weight = 1;
  
    // Calculate the compatibility score based on preferences
    let compatibilityScore = 0;

    // Calculate work compatibility
    if (currentUser.work === user.work) {
        compatibilityScore += weight;
    }  

    // Calculate smoking compatibility
    if (currentUser.smoking === user.smoking) {
      compatibilityScore += weight;
    }
  
    // Calculate drinking compatibility
    if (currentUser.drinking === user.drinking) {
      compatibilityScore += weight;
    }

    // Calculate guests compatibility
    if (currentUser.guests === user.guests) {
      compatibilityScore += weight;
    }

    // Calculate pets compatibility
    if (currentUser.pets === user.pets) {
      compatibilityScore += weight;
    }

    // Calculate food compatibility
    if (currentUser.food === user.food) {
      compatibilityScore += weight;
    }
  
    // Calculate interests compatibility (e.g., Jaccard Index)
    const commonInterests = currentUser.interests.filter((interest) =>
      user.interests.includes(interest)
    );

    compatibilityScore += (commonInterests.length)*weight;

    const commonTraits = currentUser.traits.filter((trait) =>
      user.traits.includes(trait)
    );

    compatibilityScore += (commonTraits.length)*weight;
  
    return compatibilityScore;
};

export {
    calculateCompatibilityWithAllUsers,
    getAllUsers
};
