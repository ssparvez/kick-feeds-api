const express = require("express");
const morgan = require("morgan"); // for server logging
const bodyParser = require("body-parser"); // to parse the body of incoming requests
const mongoose = require("mongoose");

const noteRoutes = require("./routes/notes");
const userRoutes = require("./routes/users");

const app = express();

// Connect to MongoDB
const { MONGO_ATLAS_PW, MONGO_ATLAS_USER, MONGO_ATLAS_HOST } = process.env;
const URI = `mongodb+srv://${MONGO_ATLAS_USER}:${MONGO_ATLAS_PW}@${MONGO_ATLAS_HOST}/test?retryWrites=true&w=majority`;
mongoose.connect(URI, { useNewUrlParser: true });

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS configuration
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/notes", noteRoutes);
app.use("/users", userRoutes);

// error handling
app.use((req, res, next) => { // create 404 error and forward to next handler
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => { // handles all other errors like 500
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;