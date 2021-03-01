const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// connect to mongodb
const mongouri = require("./config/config").MONGOURI;
mongoose
  .connect(mongouri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Successfully connect to MongoDB."))
  .catch((err) => console.log(err));

// routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to explog." });
});

const auth = require("./routes/api/auth");
app.use("/api/auth", auth);

// set port, listen for requests
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
