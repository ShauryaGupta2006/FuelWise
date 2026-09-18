const express = require("express");
const cors = require("cors");

const app = express();
const db = require("./src/config/database");
const authRoutes = require("./src/routes/authRoutes");

const User = require("./src/models/user");

app.use(cors({
    origin: true, 
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/auth", authRoutes);
app.use("/", authRoutes); 


app.get("/", (req, res) => {
    res.send("FuelWise Server Initiated Successfully");
});

app.post("/add_fuel", async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        const { email, odometer, new_range, old_range, fuel, amount, density } = req.body;
        const targetEmail = (email || "[EMAIL_ADDRESS]").toLowerCase();
        console.log("Fuel record received for:", targetEmail, { odometer, new_range, old_range, fuel, amount, density });

        console.log("Fuel record received for:", targetEmail, { odometer, new_range, old_range, fuel, amount: fuelAmount, density });

        const updatedUser = await User.findOneAndUpdate(
            { email: targetEmail },
            {
                $inc: { Total_fuel_cost: fuelAmount },
                $push: {
                    fuelRecords: {
                        odometer: Number(odometer),
                        new_range: Number(new_range),
                        old_range: Number(old_range),
                        quantity: Number(fuel),
                        fueling_amount: Number(amount),
                        density: density,
                    },
                },
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found with provided email" });
        }

        res.json({
            success: true,
            message: "Fuel record added successfully",
            totalFuelCost: updatedUser.Total_fuel_cost,
            data: updatedUser.fuelRecords,
        });
    } catch (error) {
        console.error("Error adding fuel record:", error);
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
});

app.get("/fuel_summary", async (req, res) => {
    try {
        const { email } = req.query;
        const targetEmail = (email || "[EMAIL_ADDRESS]").toLowerCase();

        const user = await User.findOne({ email: targetEmail }).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                vehicleName: user.vehicleName,
                fuelType: user.fuelType,
            },
            records: user.fuelRecords || [],
        });
    } catch (error) {
        console.error("Error fetching fuel summary:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


module.exports = app;
