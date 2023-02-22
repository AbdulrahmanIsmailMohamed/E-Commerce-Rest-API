const mongoose = require("mongoose");

const valid = require("validator");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 4,
        max: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (val) => valid.isEmail(val),
            message: `{VALUE} is not valid email`
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 5,
        validatE: {
            validator: (val) => valid.isStrongPassword(val,{ma}),
            message: `{VALUE} is not valid password`
        }
    },
    street: {
        type: String,
        default: ""
    },
    apartement: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: (val) => valid.isMobilePhone(val),
            message: `{VALUE} is not valid Phone`
        }
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

// to create a new field "id", it takes a copy of the _id
userSchema.virtual("id").get(() => {
    return this._id
});
userSchema.set("toJSON", {
    virtuals: true
});

const User = mongoose.model("User", userSchema);
module.exports = User