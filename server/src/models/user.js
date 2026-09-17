const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
        },
        vehicleName: {
            type: String,
            required: [true, "Vehicle name is required"],
            trim: true,
        },
        fuelType: {
            type: String,
            enum: ["Petrol", "Diesel", "EV", "CNG"],
            default: "Petrol",
        },
        Total_fuel_cost: {
            type: Number,
            default: 0,
        },
        fuelRecords: [
            {
                odometer: Number,
                new_range: Number,
                old_range: Number,
                quantity: Number,
                fueling_amount: Number,
                density: String,
                createdAt: { type: Date, default: Date.now },
            },
        ],
        averageAcquired: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);