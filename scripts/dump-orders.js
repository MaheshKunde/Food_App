const fs = require("fs");
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://root:food@localhost:27017/", {
	authSource: "admin", // this is necessary if you're using a username/password to connect to MongoDB
});

const orderItemSchema = new mongoose.Schema({
	id: { type: String, required: true },
	quantity: { type: Number, required: true },
});

// Define the Mongoose schema for the meals collection
const orderSchema = new mongoose.Schema({
	items: [orderItemSchema],
	customer: {
		name: { type: String, required: true },
		email: { type: String, required: true },
		street: { type: String, required: true },
		postalCode: { type: String, required: true },
		city: { type: String, required: true },
	},
	id: String,
});

// Create the Mongoose model for the meals collection
const Meal = mongoose.model("Order", orderSchema);

// Read the contents of available-meals.json
mongoose.connection.on('connected', () => {
    // Read the contents of available-meals.json
    fs.readFile("../backend/data/orders.json", "utf8", async (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return;
        }

        try {
            const meals = JSON.parse(data);

            console.log(meals)

            // Insert the meals into the database
            try {
                await Meal.insertMany(meals);
                console.log("Meals inserted successfully!");
                mongoose.disconnect();
            } catch (err) {
                console.error("Error inserting meals:", err);
            }
        } catch (err) {
            console.error("Error parsing JSON:", err);
        }
    });
});
