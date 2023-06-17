import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("db conectada Ok📗"))
  .catch((e) => console.log("algo falló " + e));
