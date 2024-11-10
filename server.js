require("dotenv").config();
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

app.use(express.json());
app.use(cors());

let db;
const uri = process.env.MONGO_URI || 'mongodb+srv://bilondabelieve283:prettyblackgirl02@cluster0.4l9sse8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        db = client.db('AnThro');
        console.log("Connected to MongoDB");
    })
    .catch(error => console.error(error));


app.post('/SignUp', async (req, res) => {
    try {
        const user = req.body;
        if (!user.password || user.password.length < 6) return res.status(400).json({ message: "Password too short" });
        if (!user.email || !user.email.includes("@")) return res.status(400).json({ message: "Invalid email format" });

        const collection = db.collection('users');
        const existingUser = await collection.findOne({ email: user.email });
        if (existingUser) return res.status(409).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(user.password, 10);
        const result = await collection.insertOne({ ...user, password: hashedPassword, createdAt: new Date() });

        res.status(201).json({ message: "User created successfully", userId: result.insertedId });
    } catch (error) {
        console.error("Error inserting user: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get('/users', async (req, res) => {
    try {
        const usersCollection = db.collection('users');
        const users = await usersCollection.find({}).toArray();
        res.json(users);
    } catch (error) {
        console.error("Error retrieving users: ", error);
        res.status(500).send('Error retrieving users');
    }
});

app.delete('/DeleteAccount/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const collection = db.collection('users');
        const result = await collection.deleteOne({ _id: new ObjectId(userId) });
        if (result.deletedCount === 0) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error("Error deleting user account: ", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
});

app.post('/Signin', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) throw new Error("Username and password are required");

        const collection = db.collection('users');
        const user = await collection.findOne({ name: username });
        if (!user) return res.status(404).json({ message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Invalid credentials" });

        res.status(200).json({ message: "Login successful", userId: user._id });
    } catch (error) {
        console.error("Error during login: ", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on http://54.144.43.43:${port}`);
});

module.exports = app;

