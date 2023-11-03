import mongoose from "mongoose";
import bcrypt from "bcryptjs";
// import { string } from "yargs";

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
    profilePhoto: {
        type: [String]
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
    budget: {
        type: Number,
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
                'music', 'dance', 'travel', 'art',
                'photography', 'running', 'cook',
                'bake', 'basketball', 'yoga', 'tv',
                'hiking','swimming','fashion',
                'netflix', 'gym', 'films', 'tennis',
                'design', 'ted', 'writing', 'party',
                'soccer', 'draw', 'climbing',
                'fitness', 'singing', 'video games',
                'shopping', 'outing', 'sports'
            ],
        },
    ],
    traits: [
        {
            type: String,
            enum: [
                'calm', 'friendly', 'organized', 'social',
                'caring', 'easy going', 'energetic',
                'relaxed', 'flexible', 'creative', 'cheerful',
                'tolerant','clean','serious',
                'active', 'balanced', 'charismatic', 'fun',
                'dramatic', 'generous', 'helpful', 'humble',
                'innovative', 'mature', 'modest',
                'reliable', 'responsible'
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
    blockedUser: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    listMySpace: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            default: function () {
                return new mongoose.Types.ObjectId();
            }
        },
        images: [String],
        title: String,
        description: String,
        budget: Number,
        location: {
            type: {
                type: String,
                enum: ['Point'], // GeoJSON point
                default: 'Point',
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                default: [0, 0], // Default coordinates
            }
      },
      attributes: [
        {
            type: String,
            enum: [
                'parking', 'laundry', 'balcony', 'hydro',
                'air-con', 'basement', 'bike-parking',
                'oven', 'concierge', 'dishwasher', 'fireplace',
                'fitness-center','patio','microwave',
                'tv', 'garbage-disposal', 'refrigerator', 'wheelchair-accessible',
                'roof-deck', 'storage', 'walkin-closet'
            ]
        }
      ],
      numOfBedrooms: {
        type: Number,
      },
      numOfBathroom: {
        type: Number,
      },
      availability: {
        type: String,
        enum: [
            'immediate', 'later'
        ]
      },
      roomSuitability: {
        type: String,
        enum: [
            'student', 'professionals', 'couples'
        ]
      },
      petFriendly: {
        type: String,
        enum: [
            'allowed', 'not-allowed'
        ]
      },
      furnished: {
        type: String,
        enum: [
            'unfurnished','fully-furnished','partially-furnished'
        ]
      }

    },
  }, 

{
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