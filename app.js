require('dotenv').config(); // Load .env file at the very top
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Use the URI from your .env file
const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => console.log("Connected to MongoDB Cluster"))
  .catch(err => console.error("Database connection error:", err));

const Account = require('./Account');;

// Add this to your app.js
app.get('/get-account/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params; // Grabs the ID from the URL

    // Find the account using the accountId field
    const account = await Account.findOne({ accountId: accountId });

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    // Send the whole document (or just the progress) back to the frontend
    res.json(account); 
  } catch (error) {
    console.error("Error fetching account:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// The route to handle the lesson progress update
app.post('/upgrade-lessons', async (req, res) => {
  console.log("Request received:", req.body); // Check if data arrives

  try {
    const { accountId, sectionName, lessonIndex } = req.body;
    const updatePath = `progress.individualSections.${sectionName}.${lessonIndex}`;

    const updatedAccount = await Account.findOneAndUpdate(
      { accountId: accountId }, 
      { $inc: { [updatePath]: 1 } },
      { new: true }
    );

    if (!updatedAccount) {
      console.log("No account found with ID:", accountId); // Log if no match
      return res.status(404).json({ error: "Account not found" });
    }

    console.log("Update successful!");
    res.json(updatedAccount);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).send(error.message);
  }
});

app.post('/create-account', async (req, res) => {
  try {
    const { accountId, accountData } = req.body;

    const updatedAccount = await Account.findOneAndUpdate(
      { accountId: accountId }, 
      accountData,
      { new: true, upsert: true } // 'upsert' creates it if it's missing!
    );

    res.json(updatedAccount);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).send(error.message);
  }
});

// The route to handle the lesson progress update
app.post('/learn-section', async (req, res) => {
  console.log("Request received:", req.body); // Check if data arrives

  try {
    const { accountId, sectionName } = req.body;
    const updatePath = `progress.individualSections.${sectionName}`;
    const progress = [0, 0, 0, 0]

    const updatedAccount = await Account.findOneAndUpdate(
      { accountId: accountId }, 
      { [updatePath]: progress },
      { new: true, upsert: true }
    );

    if (!updatedAccount) {
      console.log("No account found with ID:", accountId); // Log if no match
      return res.status(404).json({ error: "Account not found" });
    }

    console.log("Update successful!");
    res.json(updatedAccount);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).send(error.message);
  }
});

app.post('/finish-section', async (req, res) => {
  try {
    const { accountId, sectionName } = req.body;

    // 1. Define the path to the specific section to be removed
    const sectionPath = `progress.individualSections.${sectionName}`;

    const updatedAccount = await Account.findOneAndUpdate(
      { accountId: accountId }, 
      { 
        // 2. Add the section name to the completed array
        $addToSet: { "progress.completed": sectionName },
        // 3. Remove the section from the individualSections object
        $unset: { [sectionPath]: "" } 
      },
      { new: true }
    );

    if (!updatedAccount) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.json(updatedAccount);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).send(error.message);
  }
});

app.post('/update-streak', async (req, res) => {
  try {
    const { accountId, newStreak } = req.body;

    const updatedAccount = await Account.findOneAndUpdate(
      { accountId: accountId }, 
      { streak: newStreak },
      { new: true }
    );

    if (!updatedAccount) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.json(updatedAccount);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));