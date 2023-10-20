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
        required: false,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'], // Enum for gender options
        required: false,
    },
    dateOfBirth: {
        type: Date,
        required: false,
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
    work: {
        type: String,
        enum: ['Working Professional', 'Unemployed', 'Student', 'Business', 'Other'],
        required: false,
    },
    bio: {
        type: String,
        required: false,
    },
    
    smoking: {
        type: String,
        enum: ['Daily', 'Never', 'Occasional'],
        required: false,
    },
    guests: {
        type: String,
        enum: ['Daily', 'Never', 'Occasional'],
        required: false,
    },
    drinking: {
        type: String,
        enum: ['Daily', 'Never', 'Occasional'],
        required: false,
    },
    pets: {
        type: String,
        enum: ['Have', 'Dont Have', 'May Have', 'Never'],
        required: false,
    },
    food: {
        type: String,
        enum: ['Vegan', 'Vegetarian', 'Non-Vegetarian'],
    },
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
    ],
    listMySpace: {
        images: [String],
        title: String,
        description: String,
        budget: Number,
      },
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