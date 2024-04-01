const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DATABASE Connected successfull"))
    .catch((error) => {
      console.log("DATABASE Connect Failed: " + error);
      process.exit(1);
    });
};
 