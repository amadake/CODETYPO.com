const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../FRONTEND')));

// --- THE CONNECTION BLOCK ---
mongoose.connect(process.env.MONGO_URI, {
    family: 4 // <--- THIS FIXES THE CONNECTION ERROR ON ROUTERS
})
.then(() => {
    console.log("------------------------------------");
    console.log("✅ SUCCESS: Connected to MongoDB!");
    console.log("------------------------------------");
})
.catch((err) => {
    console.log("------------------------------------");
    console.log("❌ ERROR: Could not connect.");
    console.log("Reason:", err.message);
    console.log("------------------------------------");
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../FRONTEND/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Code Tpo Server is LIVE at http://localhost:${PORT}`);
});