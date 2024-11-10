require("dotenv").config();
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const cors = require('cors');
const { MongoClient } = require('mongodb');

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


    app.get('/cart', async (req, res) => {
      try {
        const collection = db.collection('cart');
        const cartItems = await collection.find({}).toArray();
    
        res.status(200).json(cartItems);
      } catch (error) {
        console.error("Error retrieving cart items:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    app.post('/transactions', async (req, res) => {
      try {
        const transaction = req.body;
    
        const collection = db.collection('transactions');
        const result = await collection.insertOne(transaction);
    
        res.status(201).json({
          message: "Transaction created successfully",
          transactionId: result.insertedId,
        });
      } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    app.post('/vehicles', async (req, res) => {
      try {
        const vehicle = req.body;
    
        const collection = db.collection('vehicles');
        const result = await collection.insertOne(vehicle);
    
        res.status(201).json({
          message: "Vehicle added successfully",
          vehicleId: result.insertedId,
        });
      } catch (error) {
        console.error("Error adding vehicle:", error);
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

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server started on http://54.144.43.43:${port}`);
});

module.exports = app;

