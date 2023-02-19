import mongoose from "mongoose";

const connection = () => {
  mongoose.set("strictQuery", true);
  mongoose.connect(
    "mongodb+srv://vikasrajput:vFJ7CmXo8GKQw2zH@cluster0.znj6hii.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) =>
      err ? console.log(err) : console.log("Connected to yourDB-name database")
  );
};

export default connection;
