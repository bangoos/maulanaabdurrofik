const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Import error handler
require("./error-handler");

const app = express();
const PORT = process.env.PORT || 3000;

// Enhanced logging
console.log("Starting application...");
console.log("Environment:", process.env.NODE_ENV);
console.log("Port:", PORT);

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Database connection with better error handling
mongoose
    .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("✅ Connected to MongoDB successfully");
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        console.error("Connection string:", process.env.MONGODB_URI ? "Set" : "Not set");
        process.exit(1);
    });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files serving - Fix path issue
const publicPath = path.join(__dirname, "public");
console.log("Serving static files from:", publicPath);
app.use(express.static(publicPath));

// Log static file requests
app.use("/css", express.static(path.join(__dirname, "public", "css")));
app.use("/js", express.static(path.join(__dirname, "public", "js")));
app.use("/images", express.static(path.join(__dirname, "public", "images")));

app.set("view engine", "ejs");

// Session configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET || "fallback-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
    }),
);

// Routes
app.use("/", require("./routes/index"));
app.use("/admin", require("./routes/admin"));
app.use("/api", require("./routes/api"));

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    });
});

// Debug static files
app.get("/debug-static", (req, res) => {
    const fs = require("fs");
    const path = require("path");

    const cssPath = path.join(__dirname, "public", "css", "style.css");
    const jsPath = path.join(__dirname, "public", "js", "main.js");

    res.json({
        css_exists: fs.existsSync(cssPath),
        js_exists: fs.existsSync(jsPath),
        css_path: cssPath,
        js_path: jsPath,
        public_dir: path.join(__dirname, "public"),
    });
});

// 404 handler
app.use((req, res) => {
    console.log("404 - Route not found:", req.path);
    res.status(404).render("404");
});

// Enhanced error handler
app.use((err, req, res, next) => {
    console.error("❌ Application error:", err);
    console.error("Stack:", err.stack);

    // Don't send error details in production
    const errorResponse = process.env.NODE_ENV === "production" ? { error: "Internal Server Error" } : { error: err.message, stack: err.stack };

    res.status(500).json(errorResponse);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 Database: ${mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"}`);
});