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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

});