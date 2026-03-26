import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        minlength: 2,
    },
    lastName: {
        type: String,
    },
    emailID: {
        type: String,
        required: [true, "Email ID is required"],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: "Invalid email address"
        },
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        validate: {
            validator: function (value) {
                return validator.isStrongPassword(value);
            },
            message: "Enter a strong password"
        }
    },
    about: {
        type: String,
        default: "I am a JavaScript developer.",
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate: {
            validator: function (value) {
                return ["male", "female", "other"].includes(value.toLowerCase());
            },
            message: "Gender must be Male, Female, or Other"
        },
    },
    photoURL: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    skills: {
        type: [String],
    }
}, { timestamps: true });

userSchema.methods.getJWT = async function() {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "secretkey", { expiresIn: '7d' });
    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordMatch = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordMatch;
}

const User = mongoose.model("User", userSchema);

export default User;