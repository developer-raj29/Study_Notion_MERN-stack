const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DATABASE Connected successfull"))
    .catch((error) => {
      console.log("DATABASE Connect Failed: " + error);
      process.exit(1);
    });
};

module.exports = dbConnect;
