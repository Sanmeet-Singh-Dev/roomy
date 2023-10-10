import mongoose from 'mongoose';

const userProfileSchema = mongoose.Schema(
    {
        // Reference to the user associated with this profile
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Reference to the User model
        },
        fullName: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'], // Enum for gender options
            required: true,
        },
        dateOfBirth: {
            type: Date,
            required: true,
        },
        location: {
            type: {
                type: String,
                enum: ['Point'], // GeoJSON point
                default: 'Point',
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                default: [0, 0], // Default coordinates
            },
        },
        smokingHabit: {
            type: String,
            enum: ['Daily', 'Never', 'Occasionally'],
            required: true,
        },
        guestsHabit: {
            type: String,
            enum: ['Daily', 'Never', 'Occasionally'],
            required: true,
        },
        drinkingHabit: {
            type: String,
            enum: ['Daily', 'Never', 'Occasionally'],
            required: true,
        },
        petsHabit: {
            type: String,
            enum: ['Daily', 'Never', 'Occasionally'],
            required: true,
        },
        foodChoices: [
            {
                type: String,
                enum: ['Vegan', 'Vegetarian', 'Kosher', 'None'],
            },
        ],
        interests: [
            {
                type: String,
                enum: [
                    'Interest 1',
                    'Interest 2',
                    'Interest 3',
                    // Add more interests here
                ],
            },
        ],
        personalTraits: [
            {
                type: String,
                enum: [
                    'Trait 1',
                    'Trait 2',
                    'Trait 3',
                    // Add more personal traits here
                ],
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Define a 2dsphere index for geospatial queries
userProfileSchema.index({ location: '2dsphere' });

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

export default UserProfile;
