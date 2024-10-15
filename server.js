require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const mongoURI = 'mongodb+srv://bilondabelieve283:prettyblackgirl02@cluster0.4l9sse8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI, {
  useUnifiedTopology: true,
})

.then(() => {
  console.log('MongoDB connected successfully');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});


app.post('/SignUp', async (req, res) => {
  try {
      const user = req.body;

      if (!user.password || user.password.length < 6) throw new Error("Password too short");
      if (!user.email || !user.email.includes("@")) throw new Error("Invalid email format");

      const collection = db.collection('users');
      const existingUser = await collection.findOne({ email: user.email });
      if (existingUser) throw new Error("Email already exists");

      const result = await collection.insertOne({
          ...user,
          createdAt: new Date(),
      });

      res.status(201).json({
          message: "User created successfully",
          userId: result.insertedId,
}); 
  } catch (error) {
      console.error("Error inserting user: ", error);
      res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

app.post('/Signin', async (req, res) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) throw new Error("Email and password are required");

    const collection = db.collection('users');
    const user = await collection.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", userId: user._id });

  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

app.put('/ChangePassword/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long" });
    }

    const collection = db.collection('users');
    const user = await collection.findOne({ _id: new mongoose.Types.ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    await collection.updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $set: { password: hashedPassword } }
    );

    res.status(200).json({ message: "Password changed successfully" });

  } catch (error) {
    console.error("Error changing password: ", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});


app.delete('/DeleteUser/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const collection = db.collection('users');
    const result = await collection.deleteOne({ _id: new mongoose.Types.ObjectId(userId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });

  } catch (error) {
    console.error("Error deleting user: ", error); 
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);

});