const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { json } = require("express");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/posts");
dotenv.config();

app.use(express.json());

main()
  .then(console.log("Db connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/post", postRoutes);

port = process.env.PORT || "5000";
app.listen("5000", () => {
  console.log("Server Running...");
});
