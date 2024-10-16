require("dotenv").config();
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

// Middleware
app.use(express.json());
const cors = require('cors');
app.use(cors()); // Allow cross-origin requests

// MongoDB connection
let db;
const uri = 'mongodb+srv://bilondabelieve283:prettyblackgirl02@cluster0.4l9sse8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your MongoDB URI
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        db = client.db('AnThro'); // Replace with your database name
        console.log("Connected to MongoDB");
    })
    .catch(error => console.error(error));

// Sign Up Route
app.post('/SignUp', async (req, res) => {
    try {
        const user = req.body;

        // Validation
        if (!user.password || user.password.length < 6) {
            return res.status(400).json({ message: "Password too short" });
        }
        if (!user.email || !user.email.includes("@")) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const collection = db.collection('users');

        // Check if user already exists
        const existingUser = await collection.findOne({ email: user.email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(user.password, 10);

        // Insert user
        const result = await collection.insertOne({
            ...user,
            password: hashedPassword, // Store hashed password
            createdAt: new Date(),
        });

        res.status(201).json({
            message: "User created successfully",
            userId: result.insertedId,
        });
    } catch (error) {
        console.error("Error inserting user: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get Users Route
app.get('/users', async (req, res) => {
    try {
        const usersCollection = db.collection('users'); // Collection name
        const users = await usersCollection.find({}).toArray();
        res.json(users);
    } catch (error) {
        console.error("Error retrieving users: ", error);
        res.status(500).send('Error retrieving users');
    }
});

// Server Listening
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
    console.log("Server running on port test 2222 ${port}");
});