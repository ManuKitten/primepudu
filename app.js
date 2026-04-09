require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // Added for stable file pathing

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// FIXED: Use absolute pathing for static files to prevent intermittent 404s
app.use(express.static(path.join(__dirname, '/'))); 

const uri = process.env.MONGO_URI;

// FIXED: Only start the server AFTER the database connection is successful
// This prevents Render from sending traffic to a non-ready app (502 error)
mongoose.connect(uri)
  .then(() => {
    console.log("✅ Connected to MongoDB Cluster");
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // FIXED: Adjust timeouts to match Render's load balancer requirements
    server.keepAliveTimeout = 120000;
    server.headersTimeout = 120500;
  })
  .catch(err => {
    console.error("❌ Database connection error:", err);
    process.exit(1); // Exit so Render knows to restart the container
  });

const Account = require('./Account');

// --- Routes remain the same ---

app.get('/get-account/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;
    const account = await Account.findOne({ accountId: accountId });
    if (!account) return res.status(404).json({ error: "Account not found" });
    res.json(account); 
  } catch (error) {
    console.error("Error fetching account:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post('/upgrade-lessons', async (req, res) => {
  try {
    const { accountId, sectionName, lessonIndex } = req.body;
    const updatePath = `progress.individualSections.${sectionName}.${lessonIndex}`;
    const updatedAccount = await Account.findOneAndUpdate(
      { accountId: accountId }, 
      { $inc: { [updatePath]: 1 } },
      { new: true }
    );
    if (!updatedAccount) return res.status(404).json({ error: "Account not found" });
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
      { new: true, upsert: true }
    );
    res.json(updatedAccount);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).send(error.message);
  }
});

app.post('/learn-section', async (req, res) => {
  try {
    const { accountId, sectionName } = req.body;
    const updatePath = `progress.individualSections.${sectionName}`;
    const progress = [0, 0, 0, 0];
    const updatedAccount = await Account.findOneAndUpdate(
      { accountId: accountId }, 
      { [updatePath]: progress },
      { new: true, upsert: true }
    );
    if (!updatedAccount) return res.status(404).json({ error: "Account not found" });
    res.json(updatedAccount);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).send(error.message);
  }
});

app.post('/finish-section', async (req, res) => {
  try {
    const { accountId, sectionName } = req.body;
    const sectionPath = `progress.individualSections.${sectionName}`;
    const updatedAccount = await Account.findOneAndUpdate(
      { accountId: accountId }, 
      { 
        $addToSet: { "progress.completed": sectionName },
        $unset: { [sectionPath]: "" } 
      },
      { new: true }
    );
    if (!updatedAccount) return res.status(404).json({ error: "Account not found" });
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
    if (!updatedAccount) return res.status(404).json({ error: "Account not found" });
    res.json(updatedAccount);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).send(error.message);
  }
});