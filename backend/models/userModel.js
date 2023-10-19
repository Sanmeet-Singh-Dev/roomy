import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true
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
    image: {
        type: String,
        // required: true
    },
    friendRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    sentFriendRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        next();
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;