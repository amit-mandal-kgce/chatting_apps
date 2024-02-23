const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://test:passtest@test-app.ocvio3l.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("connected to DB"))
  .catch((e) => console.log("error", e));
